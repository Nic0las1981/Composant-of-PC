import type { Component } from "../data/catalog.ts";
import { MARKET_MAPPINGS, MARKET_SOURCE, marketObservations, type MarketMapping, type MarketObservation } from "../data/marketObservations.ts";
import { getMarketObservation } from "./marketObservations.ts";
import { MARKET_REFERENCE_MAX_AGE_MS } from "../data/marketPolicy.ts";

const MAX_FILE_BYTES = 256 * 1024;
const MAX_PARTS = 500;
const DEFAULT_TIMEOUT_MS = 8000;
const CLOCK_CHECK_MS = 60_000;
const MAX_TIMER_DELAY_MS = 2_147_483_647;
const NATIVE_SOURCE_ROOT = "https://raw.githubusercontent.com/xxderen/pc-build/main/data/";
const LIVE_SOURCE_URL = "https://github.com/xxderen/pc-build/blob/main/data/prices.json";
const ALLOWED_AVAILABILITY = new Set(["in_stock", "shortly", "unavailable", "unknown"]);

type JsonObject = Record<string, unknown>;
export type MarketFeedState = Readonly<{
  status: "snapshot" | "refreshing" | "refreshed" | "partial" | "unavailable";
  /** Reading a public JSON file is not a merchant price verification. */
  lastAttemptAt: string | null;
  acceptedCount: number;
  rejectedCount: number;
  reason: "network" | "timeout" | "invalid-source" | null;
}>;

export interface MarketFeedOptions {
  fetch?: typeof globalThis.fetch;
  now?: () => number;
  timeoutMs?: number;
  /** Optional clock driver for tests. Browsers get one shared lifecycle clock;
   * environments without a document do not start background timers. */
  clock?: MarketFeedClock;
}

export interface MarketFeedClock {
  setInterval(callback: () => void, delayMs: number): unknown;
  clearInterval(handle: unknown): void;
  setTimeout(callback: () => void, delayMs: number): unknown;
  clearTimeout(handle: unknown): void;
  visibilityTarget?: EventTarget & { readonly visibilityState?: string };
  pageTarget?: EventTarget;
}

function browserClock(): MarketFeedClock | undefined {
  if (typeof window === "undefined" || typeof document === "undefined") return undefined;
  return {
    setInterval: (callback, delay) => window.setInterval(callback, delay),
    clearInterval: handle => window.clearInterval(handle as number),
    setTimeout: (callback, delay) => window.setTimeout(callback, delay),
    clearTimeout: handle => window.clearTimeout(handle as number),
    visibilityTarget: document,
    pageTarget: window,
  };
}

class InvalidSource extends Error {}
class FeedTimeout extends Error {}
const isObject = (value: unknown): value is JsonObject => value !== null && typeof value === "object" && !Array.isArray(value);
const own = (value: JsonObject, key: string): unknown => Object.hasOwn(value, key) ? value[key] : undefined;
const validText = (value: unknown, limit: number): value is string => typeof value === "string" && value.length > 0 && value.length <= limit && value === value.trim() && !/[\u0000-\u001f\u007f]/.test(value);

function timestamp(value: unknown, now: number): number | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed) || parsed > now || parsed < Date.UTC(2020, 0, 1)) return null;
  // Date.parse normalizes invalid calendar dates such as February 30.
  if (new Date(parsed).toISOString().slice(0, 19) !== value.slice(0, 19)) return null;
  return parsed;
}

function partTable(value: unknown): JsonObject {
  if (!isObject(value) || value.schema !== 1 || !isObject(value.parts) || Object.keys(value.parts).length > MAX_PARTS) throw new InvalidSource("Unsupported or oversized source schema");
  if (value.currency !== undefined && value.currency !== "EUR") throw new InvalidSource("Source currency changed");
  return value.parts;
}

function exactProductUrl(value: unknown, slug: string): value is string {
  if (!validText(value, 1024)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "geizhals.de" && !url.username && !url.password && !url.port && !url.hash
      && url.pathname === `/${slug}.html`
      && [...url.searchParams].every(([key, item]) => key === "hloc" && item === "de")
      && url.searchParams.getAll("hloc").length <= 1;
  } catch { return false; }
}

function matchesPart(value: unknown, mapping: MarketMapping): value is JsonObject {
  if (!isObject(value) || !isObject(value.sources)) return false;
  const expected = mapping.sourcePart;
  // In the audited source the MPN is encoded in the exact Geizhals slug, not
  // stored as a separate native field (spaces/case in an MPN are not guessed).
  // If the provider later adds an explicit identifier, a contradiction needs
  // a new audit even when the old display name and URL were left unchanged.
  for (const field of ["manufacturerPartNumber", "manufacturer_part_number", "mpn"] as const) {
    if (Object.hasOwn(value, field) && value[field] !== null && value[field] !== expected.manufacturerPartNumber) return false;
  }
  return value.id === expected.id && value.category === expected.category && value.name === expected.name
    && value.sources.geizhals === expected.geizhalsSlug;
}

async function boundedJson(fetcher: typeof globalThis.fetch, filename: "parts.json" | "prices.json", signal: AbortSignal): Promise<unknown> {
  const response = await fetcher(`${NATIVE_SOURCE_ROOT}${filename}`, {
    signal, credentials: "omit", redirect: "error", referrerPolicy: "no-referrer", cache: "no-cache",
  });
  if (!response.ok) throw new Error(`Public source returned ${response.status}`);
  const declaredLength = response.headers.get("content-length");
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_FILE_BYTES)) throw new InvalidSource("Source body is too large");
  if (!response.body) throw new InvalidSource("Source body is missing");
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const fragments: string[] = [];
  let size = 0;
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    while (true) {
      if (signal.aborted) throw new FeedTimeout("Source request expired");
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FILE_BYTES) throw new InvalidSource("Source body is too large");
      fragments.push(decoder.decode(value, { stream: true }));
    }
    fragments.push(decoder.decode());
    return JSON.parse(fragments.join("")) as unknown;
  } catch (error) {
    cancel();
    if (error instanceof FeedTimeout || error instanceof InvalidSource) throw error;
    throw new InvalidSource("Source is not valid bounded UTF-8 JSON");
  } finally {
    signal.removeEventListener("abort", cancel);
    reader.releaseLock();
  }
}

/** The same validated, public JSON files used for the bundled snapshot may be
 * refreshed in a browser. This never fetches a merchant, sends credentials,
 * changes hardware facts or claims to certify a currently purchasable offer.
 * A factory isolates state for deterministic tests; production uses one store.
 */
export function createMarketFeed(options: MarketFeedOptions = {}) {
  const fetcher: typeof globalThis.fetch = options.fetch ?? ((...args) => globalThis.fetch(...args));
  const now = options.now ?? Date.now;
  const timeoutMs = Math.max(1, Math.min(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, DEFAULT_TIMEOUT_MS));
  const listeners = new Set<() => void>();
  let revision = 0;
  let refreshed = new Map<string, MarketObservation>();
  let newestAcceptedUpdate = Date.parse(MARKET_SOURCE.sourceUpdatedAt);
  let pending: Promise<MarketFeedState> | null = null;
  let state: MarketFeedState = Object.freeze({ status: "snapshot", lastAttemptAt: null, acceptedCount: 0, rejectedCount: 0, reason: null });
  let clock: MarketFeedClock | undefined;
  let minuteTimer: unknown;
  let deadlineTimer: unknown;
  let lastClockInstant = now();
  const notify = () => {
    revision++;
    for (const listener of listeners) listener();
  };
  const getObservation = (component: Component | null | undefined): MarketObservation | null => {
    // The bundled getter enforces the audited catalogue identity, including
    // exact finish/capacity rather than a family-wide fuzzy match.
    const snapshot = getMarketObservation(component);
    return snapshot && component ? refreshed.get(component.id) ?? snapshot : null;
  };
  const armDeadline = () => {
    if (!clock) return;
    if (deadlineTimer !== undefined) clock.clearTimeout(deadlineTimer);
    deadlineTimer = undefined;
    const instant = now();
    let deadline = Infinity;
    for (const mapping of MARKET_MAPPINGS) {
      const observation = refreshed.get(mapping.component.id) ?? marketObservations[mapping.component.id];
      if (!observation) continue;
      const updated = Date.parse(observation.sourceUpdatedAt);
      // The budget window includes exactly day 14, and closes one millisecond
      // afterwards. A corrected client clock can also make a future date valid.
      for (const boundary of [updated, updated + MARKET_REFERENCE_MAX_AGE_MS + 1]) {
        if (Number.isFinite(boundary) && boundary > instant) deadline = Math.min(deadline, boundary);
      }
    }
    if (Number.isFinite(deadline)) {
      deadlineTimer = clock.setTimeout(checkTime, Math.min(MAX_TIMER_DELAY_MS, Math.max(1, deadline - instant)));
    }
  };
  function checkTime() {
    const instant = now();
    if (instant !== lastClockInstant) {
      lastClockInstant = instant;
      notify();
    }
    armDeadline();
  }
  const onVisibility = () => {
    if (clock?.visibilityTarget?.visibilityState !== "hidden") checkTime();
  };
  const startClock = () => {
    if (clock) return;
    clock = options.clock ?? browserClock();
    if (!clock) return;
    lastClockInstant = now();
    minuteTimer = clock.setInterval(checkTime, CLOCK_CHECK_MS);
    clock.visibilityTarget?.addEventListener("visibilitychange", onVisibility);
    clock.pageTarget?.addEventListener("pageshow", checkTime);
    armDeadline();
  };
  const stopClock = () => {
    if (!clock) return;
    if (minuteTimer !== undefined) clock.clearInterval(minuteTimer);
    if (deadlineTimer !== undefined) clock.clearTimeout(deadlineTimer);
    clock.visibilityTarget?.removeEventListener("visibilitychange", onVisibility);
    clock.pageTarget?.removeEventListener("pageshow", checkTime);
    minuteTimer = deadlineTimer = undefined;
    clock = undefined;
  };
  const publish = (next: MarketFeedState) => {
    state = Object.freeze(next);
    notify();
    armDeadline();
  };
  const refresh = (): Promise<MarketFeedState> => {
    if (pending) return pending;
    const attemptedAt = new Date(now()).toISOString();
    publish({ status: "refreshing", lastAttemptAt: attemptedAt, acceptedCount: 0, rejectedCount: 0, reason: null });
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const work = (async () => {
      try {
        const deadline = new Promise<never>((_, reject) => {
          timer = setTimeout(() => { controller.abort(); reject(new FeedTimeout("Source request expired")); }, timeoutMs);
        });
        const [partsDocument, pricesDocument] = await Promise.race([
          Promise.all([boundedJson(fetcher, "parts.json", controller.signal), boundedJson(fetcher, "prices.json", controller.signal)]),
          deadline,
        ]);
        const parts = partTable(partsDocument);
        const prices = partTable(pricesDocument);
        const instant = now();
        if (!isObject(pricesDocument)) throw new InvalidSource("Missing source metadata");
        const updated = timestamp(pricesDocument.updated_at, instant);
        if (updated === null || updated < newestAcceptedUpdate) throw new InvalidSource("Source timestamp is invalid or older than the latest accepted source");
        const next = new Map<string, MarketObservation>();
        for (const mapping of MARKET_MAPPINGS) {
          const part = own(parts, mapping.sourcePart.id);
          const priceEntry = own(prices, mapping.sourcePart.id);
          if (!matchesPart(part, mapping) || !isObject(priceEntry) || !isObject(priceEntry.current)) continue;
          const current = priceEntry.current;
          const amount = current.price;
          const since = timestamp(current.since, instant);
          if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > 100_000
            || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
            || (current.currency !== undefined && current.currency !== "EUR")
            || current.source !== "geizhals" || !validText(current.merchant, 160)
            || typeof current.availability !== "string" || !ALLOWED_AVAILABILITY.has(current.availability)
            || !exactProductUrl(current.url, mapping.sourcePart.geizhalsSlug)
            || since === null || since > updated) continue;
          const baseline = marketObservations[mapping.component.id];
          if (!baseline) continue;
          next.set(mapping.component.id, Object.freeze({
            ...baseline, amount, merchant: current.merchant, productURL: current.url,
            sourceURL: LIVE_SOURCE_URL, sourceCommit: null, sourceUpdatedAt: pricesDocument.updated_at as string,
            priceSince: current.since as string, checkedAt: null,
            availabilityReported: current.availability as MarketObservation["availabilityReported"],
            retrievedAt: new Date(instant).toISOString(),
          }));
        }
        if (next.size === 0) throw new InvalidSource("No audited product identity matched the source");
        // A partial refresh must not resurrect an older price or an older
        // in-stock flag from the initial snapshot for an omitted/rejected SKU.
        // Unchanged entries keep their original dates and provenance.
        refreshed = new Map([...refreshed, ...next]);
        newestAcceptedUpdate = updated;
        publish({ status: next.size === MARKET_MAPPINGS.length ? "refreshed" : "partial", lastAttemptAt: attemptedAt,
          acceptedCount: next.size, rejectedCount: MARKET_MAPPINGS.length - next.size, reason: null });
      } catch (error) {
        // Keep the last accepted values, or the immutable bundled snapshot
        // when no refresh has succeeded. A failure never becomes a zero price.
        publish({ status: "unavailable", lastAttemptAt: attemptedAt, acceptedCount: 0,
          rejectedCount: MARKET_MAPPINGS.length,
          reason: error instanceof FeedTimeout ? "timeout" : error instanceof InvalidSource ? "invalid-source" : "network" });
      } finally {
        if (timer !== undefined) clearTimeout(timer);
        controller.abort();
        pending = null;
      }
      return state;
    })();
    pending = work;
    return work;
  };
  return {
    getObservation, refresh,
    getState: () => state,
    getRevision: () => revision,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      if (listeners.size === 1) startClock();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) stopClock();
      };
    },
  };
}

const marketFeed = createMarketFeed();
export const getLiveMarketObservation = marketFeed.getObservation;
export const refreshMarketFeed = marketFeed.refresh;
export const getMarketFeedState = marketFeed.getState;
export const getMarketFeedRevision = marketFeed.getRevision;
export const subscribeMarketFeed = marketFeed.subscribe;

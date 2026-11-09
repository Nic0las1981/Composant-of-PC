import test from "node:test";
import assert from "node:assert/strict";
import { getComponent } from "../src/data/catalog.ts";
import { MARKET_MAPPINGS, marketObservations } from "../src/data/marketObservations.ts";
import { getMarketObservation } from "../src/lib/marketObservations.ts";
import { createMarketFeed, type MarketFeedClock } from "../src/lib/marketFeed.ts";
import { MARKET_REFERENCE_MAX_AGE_MS } from "../src/data/marketPolicy.ts";
import { getReferencePrice } from "../src/data/pricing.ts";

const NOW = Date.parse("2026-11-09T23:00:00Z");
const UPDATED = "2026-11-09T22:00:00Z";
const targetMapping = MARKET_MAPPINGS.find(mapping => mapping.sourcePart.id === "cpu-9800x3d")!;
const target = getComponent(targetMapping.component.id)!;
const targetSourceId = targetMapping.sourcePart.id;

function fixture() {
  const parts = Object.fromEntries(MARKET_MAPPINGS.map(mapping => [mapping.sourcePart.id, {
    id: mapping.sourcePart.id, category: mapping.sourcePart.category, name: mapping.sourcePart.name,
    sources: { geizhals: mapping.sourcePart.geizhalsSlug },
  }]));
  const prices = Object.fromEntries(MARKET_MAPPINGS.map(mapping => {
    const saved = marketObservations[mapping.component.id];
    return [mapping.sourcePart.id, { current: {
      price: saved.amount, merchant: saved.merchant, url: saved.productURL,
      source: "geizhals", availability: saved.availabilityReported, since: saved.priceSince,
    } }];
  }));
  return { parts: { schema: 1, parts }, prices: { schema: 1, updated_at: UPDATED, parts: prices } };
}

const responding = (data: ReturnType<typeof fixture>, observe?: (url: string, init?: RequestInit) => void): typeof fetch =>
  async (input, init) => {
    const url = String(input);
    observe?.(url, init);
    return new Response(JSON.stringify(url.endsWith("/parts.json") ? data.parts : data.prices), {
      status: 200, headers: { "content-type": "application/json" },
    });
  };

test("refresh reads two native public files once and preserves non-verification provenance", async () => {
  const data = fixture();
  data.prices.parts[targetSourceId].current.price = 371.25;
  data.prices.parts[targetSourceId].current.merchant = "Marchand signalé";
  data.prices.parts[targetSourceId].current.since = "2026-11-09T21:50:00Z";
  const requests: string[] = [];
  const store = createMarketFeed({ now: () => NOW, fetch: responding(data, (url, init) => {
    requests.push(url);
    assert.equal(new URL(url).origin, "https://raw.githubusercontent.com");
    assert.equal(init?.credentials, "omit");
    assert.equal(init?.redirect, "error");
    assert.ok(init?.signal instanceof AbortSignal);
  }) });
  assert.equal(requests.length, 0, "importing or reading a store must not start network requests");
  assert.deepEqual(store.getObservation(target), getMarketObservation(target));
  const revisions: number[] = [];
  const unsubscribe = store.subscribe(() => revisions.push(store.getRevision()));
  const first = store.refresh();
  const second = store.refresh();
  assert.equal(first, second, "StrictMode/concurrent callers share the same work");
  assert.equal(store.getState().status, "refreshing");
  const state = await first;
  assert.equal(state.status, "refreshed");
  assert.equal(state.acceptedCount, MARKET_MAPPINGS.length);
  assert.equal(state.rejectedCount, 0);
  assert.deepEqual(requests.sort(), [
    "https://raw.githubusercontent.com/xxderen/pc-build/main/data/parts.json",
    "https://raw.githubusercontent.com/xxderen/pc-build/main/data/prices.json",
  ]);
  const quote = store.getObservation(target)!;
  assert.equal(quote.amount, 371.25);
  assert.equal(quote.currency, "EUR");
  assert.equal(quote.market, "DE");
  assert.equal(quote.checkedAt, null);
  assert.equal(quote.priceSince, "2026-11-09T21:50:00Z");
  assert.equal(quote.sourceUpdatedAt, UPDATED);
  assert.equal(quote.retrievedAt, "2026-11-09T23:00:00.000Z");
  assert.equal(quote.sourceCommit, null);
  assert.equal(quote.sourceURL, "https://github.com/xxderen/pc-build/blob/main/data/prices.json");
  assert.equal(quote.shippingCostEUR, null);
  assert.equal(quote.conditionReported, null);
  assert.equal(quote.deliveryToFrance, null);
  assert.equal(store.getObservation({ ...target, name: `${target.name} édition différente` }), null);
  assert.deepEqual(revisions, [1, 2]);
  unsubscribe();
  await store.refresh();
  assert.deepEqual(revisions, [1, 2]);
});

test("changed identity, finish or comparator destination cannot update an audited product", async () => {
  for (const mutation of ["name", "slug", "category", "source-id", "mpn", "url", "tracking-url"] as const) {
    const data = fixture();
    const part = data.parts.parts[targetSourceId];
    const current = data.prices.parts[targetSourceId].current;
    current.price = 1;
    if (mutation === "name") part.name += " White Edition";
    if (mutation === "slug") part.sources.geizhals += "-other-model";
    if (mutation === "category") part.category = "gpu";
    if (mutation === "source-id") part.id = "cpu-new-reference";
    if (mutation === "mpn") Object.assign(part, { manufacturerPartNumber: "100-DIFFERENT-SKU" });
    if (mutation === "url") current.url = "https://example.org/buy";
    if (mutation === "tracking-url") current.url += "&tag=unexpected";
    const store = createMarketFeed({ now: () => NOW, fetch: responding(data) });
    const state = await store.refresh();
    assert.equal(state.status, "partial", mutation);
    assert.equal(state.rejectedCount, 1, mutation);
    assert.deepEqual(store.getObservation(target), getMarketObservation(target), mutation);
  }
});

test("invalid amounts, currency, stock and per-price dates fall back per product without becoming zero", async () => {
  const variants: Array<Record<string, unknown>> = [
    { price: 0 }, { price: -1 }, { price: "378.00" }, { price: 378.001 }, { price: 100_001 },
    { currency: "USD" }, { availability: "guaranteed" }, { merchant: "Marchand\nnon fiable" },
    { since: "2026-11-10T01:00:00Z" }, { since: "2026-11-09T22:30:00Z" },
    { since: "2026-02-30T01:00:00Z" },
  ];
  for (const change of variants) {
    const data = fixture();
    Object.assign(data.prices.parts[targetSourceId].current, change);
    const store = createMarketFeed({ now: () => NOW, fetch: responding(data) });
    const state = await store.refresh();
    assert.equal(state.status, "partial", JSON.stringify(change));
    assert.deepEqual(store.getObservation(target), getMarketObservation(target), JSON.stringify(change));
  }
});

test("source timestamps cannot be future, invalid or older than the immutable archive", async () => {
  for (const updated of ["2026-11-10T00:00:00Z", "2026-02-30T10:00:00Z", "2025-01-01T00:00:00Z", "today"]) {
    const data = fixture();
    data.prices.updated_at = updated;
    const store = createMarketFeed({ now: () => NOW, fetch: responding(data) });
    const result = await store.refresh();
    assert.equal(result.status, "unavailable", updated);
    assert.equal(result.reason, "invalid-source", updated);
    assert.deepEqual(store.getObservation(target), getMarketObservation(target), updated);
  }
});

test("network failure and timeout keep prices readable and can be retried", async () => {
  const data = fixture();
  let online = false;
  const store = createMarketFeed({ now: () => NOW, fetch: async (input, init) => {
    if (!online) throw new Error("offline");
    return responding(data)(input, init);
  } });
  assert.equal((await store.refresh()).reason, "network");
  assert.deepEqual(store.getObservation(target), getMarketObservation(target));
  online = true;
  assert.equal((await store.refresh()).status, "refreshed");
  const saved = store.getObservation(target);
  online = false;
  await store.refresh();
  assert.deepEqual(store.getObservation(target), saved, "a later outage preserves the last accepted source values");

  const signals: AbortSignal[] = [];
  const stalled = createMarketFeed({ now: () => NOW, timeoutMs: 15, fetch: (_input, init) => {
    signals.push(init!.signal!);
    return new Promise<Response>(() => {});
  } });
  const result = await stalled.refresh();
  assert.equal(result.reason, "timeout");
  assert.ok(signals.every(signal => signal.aborted));
  assert.deepEqual(stalled.getObservation(target), getMarketObservation(target));
});

test("bounded JSON rejects large streams, oversized collections, malformed bodies and changed currency", async () => {
  const largeBody = new ReadableStream<Uint8Array>({ start(controller) {
    controller.enqueue(new TextEncoder().encode(" ".repeat(256 * 1024 + 1)));
    controller.close();
  } });
  const oversized = createMarketFeed({ now: () => NOW, fetch: async input => String(input).endsWith("parts.json")
    ? new Response(largeBody, { headers: { "content-length": "1" } })
    : new Response(JSON.stringify(fixture().prices)) });
  assert.equal((await oversized.refresh()).reason, "invalid-source");

  const data = fixture();
  const tooMany = { ...data.parts, parts: Object.fromEntries(Array.from({ length: 501 }, (_, index) => [String(index), {}])) };
  for (const body of [JSON.stringify(tooMany), "{", JSON.stringify({ ...data.parts, currency: "USD" }), JSON.stringify({ ...data.parts, schema: 2 })]) {
    const store = createMarketFeed({ now: () => NOW, fetch: async input => new Response(String(input).endsWith("parts.json") ? body : JSON.stringify(data.prices)) });
    assert.equal((await store.refresh()).reason, "invalid-source");
    assert.deepEqual(store.getObservation(target), getMarketObservation(target));
  }
});

test("partial refresh keeps the last accepted unavailable product rather than resurrecting initial stock", async () => {
  let data = fixture();
  data.prices.parts[targetSourceId].current.price = 365;
  data.prices.parts[targetSourceId].current.availability = "unavailable";
  const store = createMarketFeed({ now: () => NOW, fetch: (input, init) => responding(data)(input, init) });
  assert.equal((await store.refresh()).status, "refreshed");
  const unavailable = store.getObservation(target)!;
  assert.equal(unavailable.amount, 365);
  assert.equal(unavailable.availabilityReported, "unavailable");

  data = fixture();
  data.prices.updated_at = "2026-11-09T22:30:00Z";
  Object.assign(data.prices.parts[targetSourceId], { current: null });
  const partial = await store.refresh();
  assert.equal(partial.status, "partial");
  assert.equal(partial.acceptedCount, MARKET_MAPPINGS.length - 1);
  assert.equal(partial.rejectedCount, 1);
  assert.deepEqual(store.getObservation(target), unavailable, "price, stock, source date and retrieval date must all stay unchanged");

  // This file is newer than the original 19:00 archive but older than the
  // accepted 22:30 source: it cannot restore a stale stock/price state either.
  data = fixture();
  data.prices.updated_at = "2026-11-09T22:15:00Z";
  const rollback = await store.refresh();
  assert.equal(rollback.status, "unavailable");
  assert.equal(rollback.reason, "invalid-source");
  assert.equal(rollback.acceptedCount, 0);
  assert.equal(rollback.rejectedCount, MARKET_MAPPINGS.length);
  assert.deepEqual(store.getObservation(target), unavailable);
});

function controlledClock(initial: number) {
  let instant = initial;
  let nextId = 0;
  const timers = new Map<number, { kind: "interval" | "timeout"; at: number; delay: number; callback: () => void }>();
  class VisibilityTarget extends EventTarget { visibilityState = "visible"; }
  const visibility = new VisibilityTarget();
  const page = new EventTarget();
  const add = (kind: "interval" | "timeout", callback: () => void, delay: number) => {
    const id = ++nextId;
    timers.set(id, { kind, at: instant + delay, delay, callback });
    return id;
  };
  const driver: MarketFeedClock = {
    setInterval: (callback, delay) => add("interval", callback, delay),
    clearInterval: id => { timers.delete(id as number); },
    setTimeout: (callback, delay) => add("timeout", callback, delay),
    clearTimeout: id => { timers.delete(id as number); },
    visibilityTarget: visibility, pageTarget: page,
  };
  return {
    driver, visibility, page, timers,
    now: () => instant,
    moveTo: (value: number) => { instant = value; },
    fire: (kind: "interval" | "timeout") => {
      const entry = [...timers].filter(([, timer]) => timer.kind === kind).sort((a, b) => a[1].at - b[1].at)[0];
      assert.ok(entry, `Expected a scheduled ${kind}`);
      const [id, timer] = entry;
      instant = Math.max(instant, timer.at);
      if (kind === "timeout") timers.delete(id);
      else timer.at = instant + timer.delay;
      timer.callback();
    },
  };
}

test("a shared precise deadline invalidates subscribed budget calculations at the 14-day boundary without fetching", (context) => {
  const sourceTime = Date.parse(getMarketObservation(target)!.sourceUpdatedAt);
  const lastEligible = sourceTime + MARKET_REFERENCE_MAX_AGE_MS;
  const clock = controlledClock(lastEligible - 20_000);
  context.mock.method(Date, "now", clock.now);
  let requests = 0;
  const store = createMarketFeed({ now: clock.now, clock: clock.driver, fetch: async () => { requests++; throw new Error("must not fetch"); } });
  const prices = [getReferencePrice(target)];
  const stopOne = store.subscribe(() => prices.push(getReferencePrice(target)));
  const stopTwo = store.subscribe(() => {});
  assert.equal(clock.timers.size, 2, "subscribers share one interval and one deadline");
  assert.equal([...clock.timers.values()].find(timer => timer.kind === "timeout")?.at, lastEligible + 1);
  assert.equal(prices[0], getMarketObservation(target)!.amount);

  clock.moveTo(lastEligible);
  clock.page.dispatchEvent(new Event("pageshow"));
  assert.equal(prices.at(-1), getMarketObservation(target)!.amount, "the exact 14-day boundary is still eligible");
  clock.fire("timeout");
  assert.equal(clock.now(), lastEligible + 1);
  assert.equal(prices.at(-1), target.price, "the subscriber recomputes the actual pricing fallback immediately after expiration");
  assert.notEqual(prices.at(-1), prices[0]);
  assert.equal(requests, 0);
  assert.equal(store.getState().status, "snapshot", "clock changes do not pretend to refresh source files");
  stopOne();
  assert.equal(clock.timers.size, 1, "the minute clock remains while another subscriber exists");
  stopTwo();
  assert.equal(clock.timers.size, 0, "there is no timer after the last unsubscribe");
});

test("visibility, pageshow and the minute clock refresh stale tabs and remove their listeners on unsubscribe", (context) => {
  const sourceTime = Date.parse(getMarketObservation(target)!.sourceUpdatedAt);
  const expires = sourceTime + MARKET_REFERENCE_MAX_AGE_MS + 1;
  const clock = controlledClock(expires - 10_000);
  context.mock.method(Date, "now", clock.now);
  const store = createMarketFeed({ now: clock.now, clock: clock.driver });
  const prices: Array<number | null> = [];
  const stop = store.subscribe(() => prices.push(getReferencePrice(target)));
  // Simulate a backgrounded browser that suspended both pending timers.
  clock.moveTo(expires + 5_000);
  clock.visibility.visibilityState = "hidden";
  clock.visibility.dispatchEvent(new Event("visibilitychange"));
  assert.equal(prices.length, 0);
  clock.visibility.visibilityState = "visible";
  clock.visibility.dispatchEvent(new Event("visibilitychange"));
  assert.equal(prices.at(-1), target.price);
  assert.equal(store.getRevision(), 1);
  clock.moveTo(clock.now() + 1_000);
  clock.page.dispatchEvent(new Event("pageshow"));
  assert.equal(store.getRevision(), 2);
  clock.fire("interval");
  assert.equal(store.getRevision(), 3);
  stop();
  assert.equal(clock.timers.size, 0);
  clock.moveTo(clock.now() + 60_000);
  clock.visibility.dispatchEvent(new Event("visibilitychange"));
  clock.page.dispatchEvent(new Event("pageshow"));
  assert.equal(store.getRevision(), 3, "lifecycle listeners stop with the final subscription");
});

import { useSyncExternalStore } from "react";
import { getMarketFeedRevision, subscribeMarketFeed } from "./marketFeed.ts";

/** Include this revision in memoized price/budget computations. It also ticks
 * at source-price expiration and on tab resume; reading it causes no network
 * request. The application explicitly starts a source refresh.
 */
export function useMarketFeedRevision(): number {
  return useSyncExternalStore(subscribeMarketFeed, getMarketFeedRevision, () => 0);
}

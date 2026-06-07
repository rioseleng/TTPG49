/// <reference lib="WebWorker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { Serwist } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[];
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher: ({ request }) =>
          request.mode === "navigate",
      },
    ],
  },
});

serwist.addEventListeners();

const CACHE_NAME = "tictactoe-cache-v7"; // bump version to force update
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./images/Tic-Tac-Toe-Logo.png",
  "./splash.html", // ensure this file exists!
];

// ✅ Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("❌ Cache addAll failed:", err);
      });
    })
  );
  self.skipWaiting();
});

// ✅ Activate + clean old cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(
          () => caches.match("./index.html") // fallback for offline
        )
      );
    })
  );
});

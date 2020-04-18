const staticCacheName = "odd-n-even-v2";

const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/mainMenu.js",
  "/icons/bare_logo.png",
  "/game",
  "/game/index.html",
  "/game/app.js",
  "/game/audio/bgm.mp3",
  "/game/audio/error.wav",
  "/game/audio/success.wav",
  "/game/audio/hover1.ogg",
  "https://fonts.googleapis.com/css2?family=Montserrat&display=swap",
  "https://cdn.materialdesignicons.com/5.0.45/css/materialdesignicons.min.css",
];

// install event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

//auto update event
self.addEventListener("message", function (event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

// fetch event
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request);
    })
  );
});

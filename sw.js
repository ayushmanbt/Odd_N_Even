const STATIC_CACHE_NAME = "oddneven-v6";

const assets = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/js/mainMenu.js",
  "/images/bare_logo.png",
  "/images/icons/72X72.png",
  "/images/icons/96X96.png",
  "/images/icons/128X128.png",
  "/images/icons/144X144.png",
  "/images/icons/152X152.png",
  "/images/icons/192X192.png",
  "/images/icons/256X256.png",
  "/images/icons/384X384.png",
  "/images/icons/512X512.png",
  "/images/icons/maskable_icon.png",
  "/game.html",
  "/js/gameRules.js",
  "/audio/bgm.mp3",
  "/audio/error.wav",
  "/audio/success.wav",
  "/audio/hover1.ogg",
  "/js/modules/localStorageHandler.js",
  "/js/modules/themeHandling.js",
  "/js/modules/audioManager.js",
  "/js/modules/sharing.js",
  "https://fonts.googleapis.com/css2?family=Montserrat&display=swap",
  "https://cdn.materialdesignicons.com/5.0.45/css/materialdesignicons.min.css",
];

// install event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
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
          .filter((key) => key !== STATIC_CACHE_NAME)
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

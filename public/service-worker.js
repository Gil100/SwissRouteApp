const CACHE_NAME = "swissroute-cache-v1";
const urlsToCache = [
  "/SwissRouteApp/index.html",
  "/SwissRouteApp/manifest.json",
  "/SwissRouteApp/icons/icon192.png",
  "/SwissRouteApp/icons/icon512.png",
  "/SwissRouteApp/icons/marker-icon.png",
  "/SwissRouteApp/icons/marker-icon-2x.png",
  "/SwissRouteApp/icons/marker-shadow.png"
];

// התקנה – קובץ ראשון שנשלח לדפדפן
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// שליפה מהמטמון תחילה
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

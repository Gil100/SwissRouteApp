// הגדרת שם המטמון ורשימת הקבצים שיש לשמור
const CACHE_NAME = "swissroute-cache-v1";
const urlsToCache = [
  "/SwissRouteApp/",
  "/SwissRouteApp/index.html",
  "/SwissRouteApp/manifest.json",
  "/SwissRouteApp/icons/icon192.png",
  "/SwissRouteApp/icons/icon512.png",
  "/SwissRouteApp/marker-icon.png",
  "/SwissRouteApp/marker-icon-2x.png",
  "/SwissRouteApp/marker-shadow.png"
];

// אירוע התקנה - מטמון פעיל
self.addEventListener("install", (event) => {
  // דרוס מהדורה קודמת וסיים התקנה
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // הוסף את כל הקבצים למטמון
      return cache.addAll(urlsToCache);
    })
  );
});

// אירוע הפעלה - הפעלת המטמון
self.addEventListener("activate", (event) => {
  // השתלט על כל הלקוחות ללא המתנה
  event.waitUntil(self.clients.claim());
  
  // נקה גרסאות מטמון ישנות
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// אירוע בקשות - שליפה מהמטמון או מהרשת
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // החזר את התגובה מהמטמון אם היא קיימת
      if (response) {
        return response;
      }
      
      // אחרת, בצע בקשה לרשת
      return fetch(event.request).then((response) => {
        // בדוק אם התגובה תקינה
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        
        // העתק התגובה (כי היא חד-פעמית)
        const responseToCache = response.clone();
        
        // הוסף את התגובה למטמון עבור בקשות עתידיות
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
});

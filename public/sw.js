const CACHE = "gaze-card-site-v1";
const SHELL = ["/", "/site.css", "/assets/hero-field-guide.webp", "/privacy/", "/terms/"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))));
self.addEventListener("fetch", (event) => { if (event.request.method === "GET" && new URL(event.request.url).origin === location.origin) event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))); });

const CACHE = "gaze-card-site-v2";
const ROUTES = ["/", "/demo/", "/privacy/", "/terms/", "/404.html"];

async function precacheShell() {
  const cache = await caches.open(CACHE);
  const assets = new Set(["/icon.svg", "/apple-touch-icon.png", "/assets/hero-field-guide.avif", "/assets/hero-field-guide.webp"]);

  for (const route of ROUTES) {
    const response = await fetch(route, { cache: "reload" });
    if (!response.ok) throw new Error(`Could not precache ${route}`);
    await cache.put(route, response.clone());
    const html = await response.text();
    for (const match of html.matchAll(/(?:src|href|srcset)=["']([^"']+)["']/g)) {
      for (const candidate of match[1].split(",")) {
        const value = candidate.trim().split(/\s+/)[0];
        const url = new URL(value, location.origin);
        if (url.origin === location.origin) assets.add(`${url.pathname}${url.search}`);
      }
    }
  }

  await Promise.all([...assets].map(async (asset) => {
    const response = await fetch(asset, { cache: "reload" });
    if (response.ok) await cache.put(asset, response);
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match("/"))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});

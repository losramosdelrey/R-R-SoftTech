/* R&R SoftTech - Service Worker (requerido para instalar la web como app) */
const CACHE = 'rr-softtech-v1';
const CORE = [
  './', 'index.html', 'servicios.html', 'nosotros.html', 'proceso.html', 'contacto.html',
  'en/index.html', 'en/services.html', 'en/about.html', 'en/process.html', 'en/contact.html',
  'css/styles.css', 'js/script.js', 'manifest.webmanifest',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(CORE.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Red primero (siempre ves la versión nueva); si no hay conexión, usa la copia guardada.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('index.html')))
  );
});

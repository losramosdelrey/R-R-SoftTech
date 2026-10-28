/* R&R SoftTech - Service Worker (requerido para instalar la web como app) */
const CACHE = 'rr-softtech-v2';
const CORE = [
  './', 'index.html', 'valora.html', 'servicios.html', 'nosotros.html', 'proceso.html', 'contacto.html',
  'en/index.html', 'en/valora.html', 'en/services.html', 'en/about.html', 'en/process.html', 'en/contact.html',
  'css/styles.css', 'css/valora.css', 'js/script.js', 'manifest.webmanifest',
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
// Solo se guardan respuestas correctas (200) y nunca peticiones parciales (Range). El instalador
// de Valora (.exe) se descarga desde GitHub (otro origen), por lo que este service worker no lo toca.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.headers.has('range')) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => null);
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => {
          if (hit) return hit;
          // Sin copia: solo para páginas se muestra el inicio; para imágenes/CSS/JS no se inventa contenido
          if (req.mode === 'navigate') return caches.match('index.html');
          return Response.error();
        })
      )
  );
});

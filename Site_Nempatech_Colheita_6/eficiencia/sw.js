const CACHE_NAME = 'nempatech-cache-v3';
const FILES_TO_CACHE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Scripts do SDK do Firebase e a fonte Montserrat (Google Fonts): cache-first,
  // para funcionar offline após o primeiro carregamento online.
  if (
    url.includes('gstatic.com/firebasejs') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((resp) => {
            cache.put(event.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }

  // Chamadas ao Firestore/Auth/Storage (firestore.googleapis.com, identitytoolkit, etc.) seguem
  // direto para a rede; o próprio SDK do Firebase já cuida do cache/fila offline dessas chamadas.
  if (url.includes('googleapis.com') || url.includes('googleapis.googleusercontent.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match('./index.html')))
  );
});

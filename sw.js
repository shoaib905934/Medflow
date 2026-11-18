// MedFlow service worker: always fetch the newest app from GitHub; use the saved copy only when offline.
const VERSION = 'medflow-v15';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.hostname === 'www.googleapis.com' || u.hostname === 'accounts.google.com' || u.hostname.endsWith('mega.co.nz') || u.hostname.endsWith('mega.nz')) return; // never cache sign-in / cloud traffic
  const isPage = req.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname.endsWith('/') || u.pathname.endsWith('manifest.json');
  e.respondWith(
    // Pages: skip the browser's 10-minute cache so new uploads show immediately
    fetch(isPage ? new Request(req, { cache: 'no-cache' }) : req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});

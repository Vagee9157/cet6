// 网络优先：有网永远拿最新内容，没网用上次缓存的，联网打开过一次就能离线看
const CACHE = 'cet6-v8';
const CORE = ["./", "index.html", "assets/style.css?v=8", "assets/data-outline.js?v=8", "assets/data-vocab.js?v=8", "assets/data-practice.js?v=8", "assets/data-listening-2.js?v=8", "assets/data-listening-3.js?v=8", "assets/data-reading-2.js?v=8", "assets/data-reading-3.js?v=8", "assets/data-writing-2.js?v=8", "assets/data-writing-3.js?v=8", "assets/data-vocab-2.js?v=8", "assets/data-vocab-3.js?v=8", "assets/data-pastpapers.js?v=8", "assets/data-audio.js?v=8", "assets/data-real.js?v=8", "assets/app.js?v=8", "manifest.json", "assets/icons/icon-192.png"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;  // 音频分段请求不进缓存（206 无法缓存）
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then((r) => r || caches.match('index.html')))
  );
});

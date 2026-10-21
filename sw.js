// 网络优先：有网永远拿最新内容，没网用上次缓存的，联网打开过一次就能离线看
const CACHE = 'cet6-v35';
const CORE = ["./", "index.html", "assets/style.css?v=35", "assets/data-outline.js?v=35", "assets/data-vocab.js?v=35", "assets/data-practice.js?v=35", "assets/data-listening-2.js?v=35", "assets/data-listening-3.js?v=35", "assets/data-reading-2.js?v=35", "assets/data-reading-3.js?v=35", "assets/data-reading-4.js?v=35", "assets/data-writing-2.js?v=35", "assets/data-writing-3.js?v=35", "assets/data-writing-4.js?v=35", "assets/data-vocab-2.js?v=35", "assets/data-vocab-3.js?v=35", "assets/data-vocab-ex.js?v=35", "assets/data-vocab-4.js?v=35", "assets/data-pastpapers.js?v=35", "assets/data-audio.js?v=35", "assets/data-real.js?v=35", "assets/chart.js?v=35", "assets/draw.js?v=35", "assets/grade.js?v=35", "assets/exam.js?v=35", "assets/vgame.js?v=35", "assets/recall.js?v=35", "assets/learn.js?v=35", "assets/data-paraphrase.js?v=35", "assets/drills.js?v=35", "assets/data-cloze-pos.js?v=35", "assets/readtools.js?v=35", "assets/review.js?v=35", "assets/ipad.js?v=35", "assets/app.js?v=35", "paper.html", "assets/paper.js?v=35", "assets/paper.css?v=35", "manifest.json", "assets/icons/icon-192.png"];

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

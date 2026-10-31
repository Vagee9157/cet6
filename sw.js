// 缓存优先：带 ?v= 的静态资源（版本号变了 URL 就变）命中缓存直接返回；页面和字体先给缓存、后台悄悄更新，下次打开就是新的
// 联网打开过一次就能离线看；发新版时把 ?v=N 和 CACHE 一起加 1
const CACHE = 'cet6-v50';
const CORE = ["./", "index.html", "assets/style.css?v=50", "assets/data-outline.js?v=50", "assets/data-vocab.js?v=50", "assets/data-practice.js?v=50", "assets/data-listening-2.js?v=50", "assets/data-listening-3.js?v=50", "assets/data-reading-2.js?v=50", "assets/data-reading-3.js?v=50", "assets/data-reading-4.js?v=50", "assets/data-writing-2.js?v=50", "assets/data-writing-3.js?v=50", "assets/data-writing-4.js?v=50", "assets/data-vocab-2.js?v=50", "assets/data-vocab-3.js?v=50", "assets/data-vocab-ex.js?v=50", "assets/data-vocab-ex-4.js?v=50", "assets/data-vocab-4.js?v=50", "assets/data-vocab-5.js?v=50", "assets/data-vocab-senses.js?v=50", "assets/data-vocab-gloss.js?v=50", "assets/data-vocab-morph.js?v=50", "assets/data-vocab-audio.js?v=50", "assets/data-pastpapers.js?v=50", "assets/data-audio.js?v=50", "assets/data-real.js?v=50", "assets/chart.js?v=50", "assets/draw.js?v=50", "assets/grade.js?v=50", "assets/sound.js?v=50", "assets/exam.js?v=50", "assets/vgame.js?v=50", "assets/recall.js?v=50", "assets/learn.js?v=50", "assets/data-paraphrase.js?v=50", "assets/drills.js?v=50", "assets/data-cloze-pos.js?v=50", "assets/readtools.js?v=50", "assets/review.js?v=50", "assets/ipad.js?v=50", "assets/app.js?v=50", "paper.html", "assets/paper.js?v=50", "assets/paper.css?v=50", "manifest.json", "assets/icons/icon-192.png"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' }))))  // 绕过 HTTP 缓存，保证装进去的是刚发布的新文件
    .then(() => self.skipWaiting()));
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
  const nav = req.mode === 'navigate';
  const store = (res) => {
    if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  };
  const opts = { ignoreSearch: nav };
  // 带版本号的静态资源、音频（文件不会变）：缓存里有就不碰网络
  if (sameOrigin && !nav && (url.search.indexOf('v=') > -1 || /\/assets\/(audio|wa)\//.test(url.pathname))) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then(store)));
    return;
  }
  // 页面 / 字体 / 其它：有缓存先用缓存，同时后台刷新；没缓存才等网络
  e.respondWith(caches.match(req, opts).then((hit) => {
    const net = fetch(req).then(store).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return net.then((res) => res || caches.match('index.html'));
  }));
});

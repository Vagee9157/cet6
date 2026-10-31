// 缓存优先：带 ?v= 的静态资源（版本号变了 URL 就变）命中缓存直接返回；页面和字体先给缓存、后台悄悄更新，下次打开就是新的
// 联网打开过一次就能离线看；发新版时把 ?v=N 和 CACHE 一起加 1
const CACHE = 'cet6-v51';
const CORE = ["./", "index.html", "dist/style.css?v=51", "dist/data.js?v=51", "dist/app.js?v=51", "dist/data-vocab-ex.js?v=51", "dist/data-vocab-ex-4.js?v=51", "dist/data-vocab-senses.js?v=51", "dist/data-vocab-gloss.js?v=51", "dist/data-vocab-morph.js?v=51", "dist/data-vocab-audio.js?v=51", "paper.html", "assets/paper.js?v=51", "assets/paper.css?v=51", "manifest.json", "assets/icons/icon-192.png"];

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

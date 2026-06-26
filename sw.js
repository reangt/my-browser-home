const CACHE_NAME = 'home-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  // 如果你有独立的css/js/图片文件，把相对路径加在这里
  // './style.css',
  // './script.js'
];

// 安装时缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 每次请求优先从缓存读取，没有再发网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

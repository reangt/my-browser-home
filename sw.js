// 升级版本号，强制浏览器重新下载缓存
const CACHE_NAME = 'home-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './1.jpg',
  './2.gif'
];

// 安装阶段：立刻接管，不再等待
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 激活阶段：自动清理之前的旧缓存（比如 v1）
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('清理旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求阶段：增加 .catch() 防止控制台满屏爆红报错
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // 命中缓存
      }
      // 没有缓存则发起网络请求，并捕获错误防止控制台报错
      return fetch(event.request).catch(() => {
        console.warn('网络请求失败或被拦截 (已忽略):', event.request.url);
      });
    })
  );
});

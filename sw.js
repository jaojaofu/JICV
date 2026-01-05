
const CACHE_NAME = 'jicv-axit-v9';

self.addEventListener('install', (event) => {
  // Buộc SW đang chờ trở thành SW đang hoạt động ngay lập tức
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Chiếm quyền điều khiển tất cả các client (tab) ngay khi kích hoạt
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Dọn dẹp cache cũ
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) return caches.delete(cache);
          })
        );
      })
    ])
  );
});

// Lắng nghe tin nhắn hiển thị thông báo
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_NOTIF') {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title, {
        ...options,
        badge: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        tag: 'jicv-acid-alert'
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('/');
    })
  );
});

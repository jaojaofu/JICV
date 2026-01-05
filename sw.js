
const CACHE_NAME = 'jicv-axit-v8';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Lắng nghe tin nhắn hiển thị thông báo
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_NOTIF') {
    const { title, options } = event.data;
    // Đảm bảo dùng self.registration để hiển thị
    event.waitUntil(
      self.registration.showNotification(title, {
        ...options,
        // Cần thiết cho Android để hiển thị nổi bật
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
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

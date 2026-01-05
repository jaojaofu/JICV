
const CACHE_NAME = 'jicv-axit-v10';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_NOTIF') {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title, {
        ...options,
        badge: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        // Kiểu rung cực mạnh: Rung 1s, nghỉ 0.5s, lặp lại 3 lần
        vibrate: [1000, 500, 1000, 500, 1000, 500, 1000],
        tag: 'jicv-acid-critical',
        renotify: true,
        requireInteraction: true // Thông báo sẽ không tự biến mất cho đến khi nhấn vào
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

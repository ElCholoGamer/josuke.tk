self.addEventListener('push', event => {
	const { title, options = {} } = event.data.json();
	if (!title) return;

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
	const { notification } = event;
	notification.close();

	const { url } = notification.data;
	if (url) event.waitUntil(clients.openWindow(url));
});

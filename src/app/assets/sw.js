self.addEventListener('push', event => {
	const { title, options = {} } = event.data.json();
	if (!title) return;

	event.waitUntil(self.registration.showNotification(title, options));
});

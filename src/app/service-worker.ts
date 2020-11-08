export const register = () =>
	window.addEventListener('load', async () => {
		if (!('serviceWorker' in navigator && 'PushManager' in window)) return;
		console.log('Registering service worker...');

		try {
			await navigator.serviceWorker.register('/sw.js');
			console.log('Service Worker registered!');
		} catch (err) {
			console.error('Error registering service worker:', err);
			return;
		}

		if ((await Notification.requestPermission()) !== 'granted') return;
		console.log('Subscribing to push notifications...');

		const { key } = await (await fetch('/api/vapidkey')).json();

		const serviceWorker = await navigator.serviceWorker.ready;
		const subscription = await serviceWorker.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: key,
		});

		const res = await (
			await fetch('/api/subscribe', {
				method: 'POST',
				body: JSON.stringify(subscription),
				headers: { 'Content-Type': 'application/json' },
			})
		).json();
		console.log('Subscribe response:', res);
	});

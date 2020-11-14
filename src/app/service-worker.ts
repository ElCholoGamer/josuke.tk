import axios from 'axios';

export const register = async (Authorization: string) => {
	// Check if navigator supports service workers
	if (
		!('serviceWorker' in navigator && 'PushManager' in window) ||
		process.env.NODE_ENV !== 'production'
	) {
		alert("This navigator or window doesn't support service workers!");
		return;
	}

	// Register service worker
	try {
		await navigator.serviceWorker.register('/sw.js');
	} catch (err) {
		alert(
			`Error registering service worker: ${
				err.message || '[no message provided]'
			}`
		);
		return;
	}

	// Request permission for notifications
	if ((await Notification.requestPermission()) !== 'granted') {
		alert('You must grant notification permissions!');
		return;
	}

	// Get public VAPID key
	const {
		data: { key },
	} = await axios.get('/api/vapidkey');
	if (!key) {
		alert('No VAPID key found!');
		return;
	}

	// Subscribe service worker
	const serviceWorker = await navigator.serviceWorker.ready;
	const subscription = await serviceWorker.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: key,
	});

	const res = await axios.post('api/admin/subscribe', subscription, {
		headers: { Authorization },
	});

	const { message, subscription_id } = res.data;
	window.localStorage.setItem('subscription_id', subscription_id);

	switch (res.status) {
		case 204:
			alert('You have subscribed succesfully!');
			break;
		case 409:
			alert('You are already subscribed!');
			break;
		case 500:
			alert(`An internal server error occurred: ${message}`);
			break;
		default:
			alert(`Unknown response status code: ${message}`);
			break;
	}
};

export const unregister = () => {
	if (!('serviceWorker' in navigator && 'PushManager' in window)) {
		alert("This navigator or window doesn't support service workers!");
		return;
	}

	const id = window.localStorage.getItem('subscription_id');
	if (!id) {
		alert('You are not subscribed!');
		return;
	}

	navigator.serviceWorker.ready
		.then(sw => sw.unregister())
		.then(() => alert('Service worker unregistered!'))
		.catch(err =>
			alert(
				`Error unregistering service worker: ${
					err.message || '[no message provided]'
				}`
			)
		);
};

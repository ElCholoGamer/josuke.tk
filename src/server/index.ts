import server, { setupApp } from './app';

setupApp().then(() => {
	const { PORT = 80 } = process.env;
	server.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
});

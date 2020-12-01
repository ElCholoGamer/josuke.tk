import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { join, resolve } from 'path';
import errorHandler from './middleware/error-handler';
import apiRouter from './routers/api';
import closeRouter from './routers/close';
import dblWebhook from './routers/dbl-webhook';
import oauthRouter from './routers/oauth';
import { connect } from './util/db';
import { stringify } from './util/utils';

const app = express();

// Settings
app.enable('trust proxy');

// General middleware
app.use(cors());
app.use(express.json());
if (process.env.TS_NODE_DEV) app.use(morgan('common'));

// Connect to database and set up routes
console.log('Connecting to database...');
connect().then(() => {
	console.log('Database connected!');

	// Routes
	app.use('/api', apiRouter);
	app.use('/oauth', oauthRouter);
	app.use('/close', closeRouter);
	app.use('/dblwebhook', dblWebhook);

	if (!process.env.TS_NODE_DEV) {
		// Static files
		const BUILD = resolve(__dirname, '../build');
		app.use(express.static(BUILD));

		// React app
		app.get('*', (req, res, next) => {
			const {
				method,
				headers: { accept = '' },
			} = req;

			if (method === 'GET' && accept.indexOf('text/html') !== -1) {
				res.sendFile(join(BUILD, 'index.html'));
			} else {
				next();
			}
		});
	} else {
		// Development login redirect
		app.get('/', (req, res) => {
			res.redirect(`http://localhost:3000/?${stringify(req.query)}`);
		});
	}

	app.use(errorHandler);

	const { PORT = 80 } = process.env;
	app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
});

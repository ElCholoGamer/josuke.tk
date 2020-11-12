import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routers/api';
import closeRouter from './routers/close';
import oauthRouter from './routers/oauth';
import decompressor from './middleware/decompressor';
import { connectDatabase } from './util/db';
import errorHandler from './middleware/error-handler';
import { HEROKU, NODE_ENV } from './util/enviroment';
import { stringify } from './util/utils';
import http from 'http';
import dblWebhook from './routers/dbl-webhook';

const app = express();
const server = http.createServer(app);

// Settings
app.enable('trust proxy');

// Static files
const BUILD_PATH = path.join(__dirname, '..', '..', 'build');
app.use(express.static(BUILD_PATH));
app.use(express.static(path.join(__dirname, '..', 'app', 'assets')));

// General middleware
app.use(express.json(), cors());
app.use('*.js', decompressor);
if (HEROKU === 'false') app.use(morgan('dev'));

// Connect to database and set up routes
export const setupApp = () =>
	connectDatabase().then(async () => {
		console.log('Database connected!');

		// Routes
		app.use('/api', apiRouter);
		app.use('/oauth', oauthRouter);
		app.use('/close', closeRouter);
		app.use('/dblwebhook', dblWebhook);

		if (NODE_ENV === 'production') {
			// React app
			app.get('*', (req, res) => {
				res.status(200).sendFile(path.join(BUILD_PATH, 'index.html'));
			});
		} else {
			// Development login redirect
			app.get('/', (req, res) => {
				res
					.status(200)
					.redirect(`http://localhost:3000/?${stringify(req.query)}`);
			});
		}

		app.use(errorHandler);
	});

export default server;

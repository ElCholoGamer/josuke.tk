import cors from 'cors';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import decompressor from './middleware/decompressor';
import errorHandler from './middleware/error-handler';
import apiRouter from './routers/api';
import closeRouter from './routers/close';
import dblWebhook from './routers/dbl-webhook';
import oauthRouter from './routers/oauth';
import { connect } from './util/db';
import { HEROKU, NODE_ENV } from './util/enviroment';
import { stringify } from './util/utils';

const app = express();
const server = http.createServer(app);

// Settings
app.set('json spaces', 2);
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
	connect().then(() => {
		console.log('Database connected!');

		// Routes
		app.use('/api', apiRouter);
		app.use('/oauth', oauthRouter);
		app.use('/close', closeRouter);
		app.use('/dblwebhook', dblWebhook);

		if (NODE_ENV === 'production') {
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

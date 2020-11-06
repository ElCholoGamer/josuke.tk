import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routers/api';
import closeRouter from './routers/close';
import oauthRouter from './routers/oauth';
import botRouter from './routers/bot';
import configRouter from './routers/config';
import decompressor from './middleware/decompressor';
import { connectDatabase } from './util/db';
import errorHandler from './middleware/error-handler';
dotenv.config();

process.env.NODE_ENV = process.argv.includes('-d')
	? 'development'
	: 'production';

process.env.HEROKU =
	(process.env._ || '').indexOf('heroku') !== -1 ? 'true' : 'false';

const app = express();
const { PORT = 80 } = process.env;

// Settings
app.set('json spaces', 2);
app.enable('trust proxy');

// Static files
const BUILD_PATH = path.join(__dirname, '..', '..', 'build');
app.use(express.static(BUILD_PATH));
app.use(express.static(path.join(__dirname, '..', 'app', 'assets')));

// General middleware
app.use(express.json(), cors());
if (process.env.HEROKU === 'false') app.use(morgan('dev'));
app.use('*.js', decompressor);

// Connect to database
connectDatabase()
	.then(() => {
		console.log('Database connected!');

		// Routes
		app.use('/api', apiRouter);
		app.use('/config', configRouter);
		app.use('/oauth', oauthRouter);
		app.use('/bot', botRouter);
		app.use('/close', closeRouter);

		// React app
		if (process.env.NODE_ENV === 'production') {
			app.get('*', (req, res) => {
				res.status(200).sendFile(path.join(BUILD_PATH, 'index.html'));
			});
		}

		app.use(errorHandler);
	})
	.catch(console.error);

// Listening
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));

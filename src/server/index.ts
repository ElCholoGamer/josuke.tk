import dotenv from 'dotenv';
dotenv.config();

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

const app = express();
const PORT = process.env.PORT || 80;

// Settings
app.set('json spaces', 2);
app.enable('trust proxy');

// Middleware
app.use(express.json(), cors());
app.use('*.js', decompressor);
if (!process.env._ || process.env._.indexOf('heroku') === -1)
	app.use(morgan('dev'));

// Static files
export const BUILD_PATH = path.join(__dirname, '..', '..', 'build');
app.use(express.static(BUILD_PATH));
app.use(express.static(path.join(__dirname, '..', 'app', 'assets')));

// Routes
app.use('/api', apiRouter);
app.use('/config', configRouter);
app.use('/oauth', oauthRouter);
app.use('/bot', botRouter);
app.use('/close', closeRouter);

if (!process.argv.includes('-d')) {
	app.get('*', (req, res) => {
		res.status(200).sendFile(path.join(BUILD_PATH, 'index.html'));
	});
}

// Listening
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));

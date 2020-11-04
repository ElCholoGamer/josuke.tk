import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import indexRouter from './routers/index';
import apiRouter from './routers/api';
import closeRouter from './routers/close';
import oauthRouter from './routers/oauth';
import botRouter from './routers/bot';

const app = express();
const PORT = process.env.PORT || 80;

// Settings
app.set('json spaces', 2);
app.enable('trust proxy');

// Middleware
app.use(express.json());
app.use(cors());

// Routers
app.use('/api', apiRouter);
app.use('/oauth', oauthRouter);
app.use('/bot', botRouter);
app.use('/close', closeRouter);

if (process.env.NODE_ENV === 'production') {
	// React app
	app.use(express.static(path.join(__dirname, 'build')));
	app.use(express.static(path.join(__dirname, '..', 'app', 'assets')));
	app.use('/', indexRouter);
}

// Listening
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));

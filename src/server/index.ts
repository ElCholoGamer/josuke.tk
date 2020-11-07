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
import env from './util/enviroment';
import { stringify } from './util/utils';

const app = express();
const { PORT = 80 } = env;

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
if (env.HEROKU === 'false') app.use(morgan('dev'));

// Connect to database
connectDatabase()
	.then(() => {
		console.log('Database connected!');

		// Routes
		app.use('/api', apiRouter);
		app.use('/oauth', oauthRouter);
		app.use('/close', closeRouter);

		if (env.NODE_ENV === 'production') {
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
	})
	.catch(console.error);

// Listening
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));

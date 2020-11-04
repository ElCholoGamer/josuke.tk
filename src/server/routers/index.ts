import express from 'express';
import path from 'path';
import { BUILD_PATH } from '../server';

const router = express.Router();

router.get('*', (req, res, next) => {
	if (!process.argv.includes('-d'))
		res.status(200).sendFile(path.join(BUILD_PATH, 'index.html'));
	next();
});

export default router;

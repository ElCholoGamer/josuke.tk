import express from 'express';
import path from 'path';
import { BUILD_PATH } from '../server';

const router = express.Router();

router.get('*', (req, res) => {
	res.status(200).sendFile(path.join(BUILD_PATH, 'index.html'));
});

export default router;

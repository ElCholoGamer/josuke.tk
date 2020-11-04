import express from 'express';
import path from 'path';

const router = express.Router();

router.get('*', (req, res) => {
	res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
});

export default router;

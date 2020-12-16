import express from 'express';

const router = express.Router();

router.get('/close', (req, res) => res.send('<script>window.close()</script>'));

router.get('/support', (req, res) => {
	res.redirect('https://discord.gg/gbjaEDzRXU');
});

export default router;

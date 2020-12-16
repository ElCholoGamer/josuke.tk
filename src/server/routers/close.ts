import { RequestHandler } from 'express';

const closeRoute: RequestHandler = (req, res) => {
	res.send('<script>window.close()</script>');
};

export default closeRoute;

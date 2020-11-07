import express from 'express';
import adminAuth from '../../middleware/admin-auth';

const router = express.Router();

router.use(adminAuth);

export default router;

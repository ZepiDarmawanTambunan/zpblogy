import express from 'express';
import * as refreshToken from './handler/refresh-tokens/index.js';

const router = express.Router();

router.post('/refresh-token', refreshToken);

export default router;
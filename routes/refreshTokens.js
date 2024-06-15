const express = require('express');
const refreshToken = require('./handler/refresh-tokens/index.js');

const router = express.Router();

router.post('/refresh-token', refreshToken.refreshToken);

module.exports = router;
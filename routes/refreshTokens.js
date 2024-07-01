const express = require('express');
const refreshToken = require('./handler/refresh-tokens/index.js');

const router = express.Router();

router.post('/', refreshToken.refreshToken);

module.exports = router;
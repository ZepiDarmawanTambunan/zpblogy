const express = require('express');
const articlesHandler = require('./handler/articles/index.js');
const verifyToken = require('../middlewares/verifyToken.js');
const upload = require('../config/multerConfig');

const router = express.Router();

router.get('/', articlesHandler.getAll);
router.get('/:id', articlesHandler.get);
router.post('/', verifyToken, upload.array('images', 10), articlesHandler.create);
router.put('/:id', verifyToken, upload.array('images', 10), articlesHandler.update);
router.delete('/:id', verifyToken, articlesHandler.destroy);

module.exports = router;
const express = require('express');
const articlesHandler = require('./handler/articles/index.js');
const verifyToken = require('../middlewares/verifyToken.js');
const upload = require('../config/multerConfig');

const router = express.Router();

router.get('/', articlesHandler.getAll);
router.get('/:id', articlesHandler.get);
router.post('/', verifyToken, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), articlesHandler.create);
router.put('/:id', verifyToken, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), articlesHandler.update);
router.delete('/:id', verifyToken, articlesHandler.destroy);

module.exports = router;
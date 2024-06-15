const express = require('express');
const articlesHandler = require('./handler/articles/index.js');

const router = express.Router();

router.get('/all', articlesHandler.getAll);
router.get('/:id', articlesHandler.get);
router.post('/', articlesHandler.create);
router.put('/:id', articlesHandler.update);
router.delete('/:id', articlesHandler.destroy);

module.exports = router;
const express = require('express');
const commentsHandler = require('./handler/comments/index.js');
const router = express.Router();

router.get('/', commentsHandler.getAll);
router.post('/', commentsHandler.create);
router.put('/:id', commentsHandler.update);
router.get('/:id', commentsHandler.get);
router.delete('/:id', commentsHandler.destroy);

module.exports = router;
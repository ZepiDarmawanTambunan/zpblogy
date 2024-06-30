const express = require('express');
const commentsHandler = require('./handler/comments/index.js');
const router = express.Router();

router.post('/', commentsHandler.create);
router.put('/:id', commentsHandler.update);
router.get('/:id', commentsHandler.get);
router.get('/parent/:parentId', commentsHandler.getByParentId);
router.delete('/:id', commentsHandler.destroy);

module.exports = router;
const express = require('express');
const ratingsHandler = require('./handler/ratings/index.js');
const router = express.Router();

router.get('/', ratingsHandler.getAll);
router.get('/:id', ratingsHandler.get);
router.post('/', ratingsHandler.create);
router.put('/:id', ratingsHandler.update);
router.delete('/:id', ratingsHandler.destroy);

module.exports = router;
const express = require('express');
const tagsHandler = require('./handler/tags/index.js');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const can = require('../middlewares/permission.js');

router.get('/', tagsHandler.getAll);
router.get('/:id', tagsHandler.get);
router.post('/', verifyToken, can('master'), tagsHandler.create);
router.put('/:id', verifyToken, can('master'), tagsHandler.update);
router.delete('/:id', verifyToken, can('master'), tagsHandler.destroy);

module.exports = router;
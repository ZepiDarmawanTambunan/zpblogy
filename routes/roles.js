const express = require('express');
const rolesHandler = require('./handler/roles/index.js');
const verifyToken = require('../middlewares/verifyToken.js');
const can = require('../middlewares/permission.js');

const router = express.Router();

router.get('/all', verifyToken, can('master'), rolesHandler.getAll);
router.get('/', verifyToken, can('master'), rolesHandler.paginate);
router.get('/:id', verifyToken, can('master'), rolesHandler.get);
router.post('/', verifyToken, can('master'), rolesHandler.create);
router.put('/:id', verifyToken, can('master'), rolesHandler.update);
router.delete('/:id', verifyToken, can('master'), rolesHandler.destroy);

module.exports = router;
const express = require('express');
const router = express.Router();
const usersHandler = require('./handler/users/index.js');
const verifyToken = require('../middlewares/verifyToken.js');
const can = require('../middlewares/permission.js');

router.post('/register', usersHandler.register);
router.post('/login', usersHandler.login);
router.post('/logout', verifyToken, usersHandler.logout);
router.put('/:id', verifyToken, usersHandler.update);
router.get('/:id', verifyToken, usersHandler.getUser);
router.get('/', verifyToken, can('master'), usersHandler.getUsers);

module.exports = router;
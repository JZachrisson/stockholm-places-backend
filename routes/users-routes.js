const express = require('express');

const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersController.getAllUsers);

router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

module.exports = router;

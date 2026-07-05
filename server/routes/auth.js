const express = require('express');
const UserController = require('../controllers/UserController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', auth, UserController.getUserInfo);

module.exports = router;

const express = require('express');
const UserController = require('../controllers/UserController');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, requireAdmin, UserController.getUsers);
router.post('/', auth, requireAdmin, UserController.createUser);
router.delete('/:id', auth, requireAdmin, UserController.deleteUser);
router.get('/workers', auth, requireAdmin, UserController.getWorkers);

module.exports = router;

const express = require('express');
const VisitorController = require('../controllers/VisitorController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, VisitorController.createVisitor);
router.get('/owner', auth, VisitorController.getOwnerVisitors);
router.put('/:id', auth, VisitorController.updateVisitor);
router.delete('/:id', auth, VisitorController.deleteVisitor);

module.exports = router;

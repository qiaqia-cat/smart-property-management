const express = require('express');
const PropertyFeeController = require('../controllers/PropertyFeeController');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, requireAdmin, PropertyFeeController.getAllFees);
router.get('/owner', auth, PropertyFeeController.getOwnerFees);
router.put('/:id/pay', auth, PropertyFeeController.payFee);
router.post('/batch', auth, requireAdmin, PropertyFeeController.batchCreateFees);
router.put('/:id/remind', auth, requireAdmin, PropertyFeeController.remindFee);

module.exports = router;
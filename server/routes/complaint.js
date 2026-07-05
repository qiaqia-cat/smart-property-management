const express = require('express');
const ComplaintController = require('../controllers/ComplaintController');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, ComplaintController.createComplaint);
router.get('/owner', auth, ComplaintController.getOwnerComplaints);
router.get('/all', auth, requireAdmin, ComplaintController.getAllComplaints);
router.get('/:id', auth, ComplaintController.getComplaintDetail);
router.put('/:id/handle', auth, requireAdmin, ComplaintController.handleComplaint);
router.delete('/:id', auth, requireAdmin, ComplaintController.deleteComplaint);

module.exports = router;

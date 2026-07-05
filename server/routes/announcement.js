const express = require('express');
const AnnouncementController = require('../controllers/AnnouncementController');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, requireAdmin, AnnouncementController.createAnnouncement);
router.get('/all', auth, AnnouncementController.getAllAnnouncements);
router.get('/:id', auth, AnnouncementController.getAnnouncementDetail);
router.put('/:id', auth, requireAdmin, AnnouncementController.updateAnnouncement);
router.delete('/:id', auth, requireAdmin, AnnouncementController.deleteAnnouncement);

module.exports = router;

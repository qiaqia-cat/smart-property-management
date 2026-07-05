const express = require('express');
const ParkingController = require('../controllers/ParkingController');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, requireAdmin, ParkingController.createParking);
router.get('/', auth, requireAdmin, ParkingController.getAllParkings);
router.get('/:id', auth, requireAdmin, ParkingController.getParkingDetail);
router.put('/:id/exit', auth, requireAdmin, ParkingController.exitParking);
router.put('/:id', auth, requireAdmin, ParkingController.updateParking);
router.delete('/:id', auth, requireAdmin, ParkingController.deleteParking);

module.exports = router;
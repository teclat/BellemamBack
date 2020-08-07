const { Router } = require('express');

const router = Router();
const eventController = require('../controllers/EventControllers');

const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');
const multer = require('multer');

router.use(checkAuth);

router.post(
	'/:userId/create',
	multer(fileUpload).any(),
	eventController.create,
);
router.get('/:userId', eventController.index);
router.get('/id/:eventId', eventController.getEventById);
router.patch('/:eventId/edit', multer(fileUpload).any(), eventController.edit);

module.exports = router;

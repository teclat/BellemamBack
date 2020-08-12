const { Router } = require('express');

const router = Router();
const galleryController = require('../controllers/GalleryControllers');

const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.post('/create', galleryController.create);
router.post('/remove', galleryController.remove);
router.post('/event', galleryController.imagesByEventId);

module.exports = router;
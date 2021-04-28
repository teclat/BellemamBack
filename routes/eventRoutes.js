const { Router } = require('express');

const router = Router();
const eventController = require('../controllers/EventControllers');

const checkAuth = require('../middleware/check-auth');

router.get('/event/:url', eventController.getByUrl);

router.use(checkAuth);

router.post('/:userId/create', eventController.create);
router.get('/:userId', eventController.index);
router.get('/gifts/:eventId', eventController.getGiftList);
router.get('/id/:eventId', eventController.getEventById);
router.get('/:eventId/dashboard', eventController.dashboard);
router.get('/:eventId/gifteds', eventController.getGifteds);
router.get('/verify/:url', eventController.verifyUrl);
router.post('/give-gift', eventController.giveGift);
router.patch('/event-products', eventController.saveProducts);
router.patch('/:eventId/edit', eventController.edit);
router.delete('/:eventId', eventController.delete);

module.exports = router;

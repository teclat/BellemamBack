const { Router } = require('express');

const router = Router();
const eventController = require('../controllers/EventControllers');

const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.post('/:userId/create', eventController.create);
router.get('/:userId', eventController.index);
router.get('/id/:eventId', eventController.getEventById);
router.patch('/:eventId/edit', eventController.edit);

module.exports = router;

const { Router } = require('express');

const router = Router();
const userController = require('../controllers/UserControllers');

const checkAuth = require('../middleware/check-auth');

router.post('/create', userController.create);
router.post('/login', userController.login);

router.use(checkAuth);
router.get('/:userId', userController.get);
router.post('/update', userController.update);
router.post('/subscribe', userController.subscribeToEvent);
router.post('/subscribed-events', userController.subscribedEvents);

module.exports = router;

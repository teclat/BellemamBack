const { Router } = require('express');

const router = Router();
const eventController = require('../controllers/EventControllers');

router.post('/:userId/create', eventController.create);
router.get('/:userId', eventController.index);
router.patch('/:eventId/edit', eventController.edit);

module.exports = router;

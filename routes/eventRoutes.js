const { Router } = require('express');

const router = Router();
const eventController = require('../controllers/EventControllers');

router.post('/:userId/create', eventController.create);

router.patch('/edit/:eventId', eventController.edit);

module.exports = router;

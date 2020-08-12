const { Router } = require('express');

const router = Router();
const noteController = require('../controllers/NoteControllers');

const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/all', noteController.index);
router.post('/create', noteController.create);
router.post('/update', noteController.edit);
router.post('/user', noteController.notesByUserId);
router.post('/event', noteController.notesByEventId);

module.exports = router;
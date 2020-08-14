const { Router } = require('express');

const router = Router();
const customController = require('../controllers/CustomWebsiteControllers');

const checkAuth = require('../middleware/check-auth');

router.get('/:field', customController.get);

router.use(checkAuth);
router.post('/', customController.edit);

module.exports = router;
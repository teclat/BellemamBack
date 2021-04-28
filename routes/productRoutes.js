const { Router } = require('express');

const router = Router();
const productController = require('../controllers/ProductControllers');

const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/', productController.index);

module.exports = router;

const { Router } = require('express');

const router = Router();
const productController = require('../controllers/ProductControllers');

const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/', productController.index);
router.get('/:productId', productController.indexProductById);
router.post('/create', productController.create);
router.patch('/:productId/edit', productController.edit);

module.exports = router;

const { Router } = require('express');

const router = Router();
const productController = require('../controllers/ProductControllers');

router.get('/', productController.index);
router.get('/:productId', productController.indexProductById);
router.post('/create', productController.create);
router.patch('/:productId/edit', productController.edit);

module.exports = router;

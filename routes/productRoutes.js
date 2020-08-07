const { Router } = require('express');

const router = Router();
const productController = require('../controllers/ProductControllers');

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

router.use(checkAuth);

router.get('/', productController.index);
router.get('/:productId', productController.indexProductById);
router.post(
	'/create',
	multer(fileUpload).single('image'),
	productController.create,
);
router.patch(
	'/:productId/edit',
	multer(fileUpload).single('image'),
	productController.edit,
);

module.exports = router;

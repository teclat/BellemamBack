const Product = require('../models/Product');
const HttpError = require('../models/http-error');
const imageUpload = require('../middleware/image-upload');

exports.index = async (req, res, next) => {
	try {
		const products = await Product.findAll();
		if (!products) {
			const error = new HttpError('Could not find any product', 404);
			return next(error);
		}
		return res.status(200).json(products);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error!', 500);
		return next(error);
	}
};

exports.indexProductById = async (req, res, next) => {
	const { productId } = req.params;

	try {
		const product = await Product.findOne({ where: { id: productId } });
		if (!product) {
			const error = new HttpError(
				'Could not find any product with the given id',
				422,
			);
			return next(error);
		}
		return res.status(200).json(product);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Could not verify the product', 500);
		return next(error);
	}
};

exports.create = async (req, res, next) => {
	const { name, description, price, available = false, image } = req.body;
	console.log("ENTROOUU");

	try {
		const checkProduct = await Product.findOne({ where: { name: name } });
		if (checkProduct) {
			const error = new HttpError('Product name already in the database', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Could not verify the product', 500);
		return next(error);
	}

	try {
		const createdProduct = await Product.create({
			name,
			description,
			price,
			available,
		});
		const location = await imageUpload(image, 'product-' + createdProduct.id)
		const product = await createdProduct.update({
			image_url: location
		});

		return res.status(200).json(product);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create product failed', 500);
		return next(error);
	}
};

exports.edit = async (req, res, next) => {
	const { name, description, price, available, image } = req.body;
	const { productId } = req.params;

	let product;
	try {
		product = await Product.findOne({ where: { id: productId } });
		if (!product) {
			const error = new HttpError(
				'Could not find any product for the provided ID',
				404,
			);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError(
			'Unable to find any product - server error',
			500,
		);
		return next(error);
	}

	const location = await imageUpload(image, 'product-' + product.id)

	product.image_url = location;
	product.name = name;
	product.description = description;
	product.price = price;
	product.available = available;

	try {
		await product.save();
		return res
			.status(200)
			.json({ message: 'Product edited!', product: product });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to save the event', 500);
		return next(error);
	}
};

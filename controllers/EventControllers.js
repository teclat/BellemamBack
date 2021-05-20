const imageUpload = require('../middleware/image-upload');
const sequelize = require('sequelize');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Event = require('../models/Event');
const Gifted = require('../models/Gifted');
const Product = require('../models/Product');
const Note = require('../models/Note');
const EventProduct = require('../models/EventProduct');
const ProductList = require('../models/ProductList');

exports.index = async (req, res, next) => {
	const { userId } = req.params;

	try {
		const events = await Event.findAll({
			where: { user_id: userId },
			include: ['product_list'],
		});
		if (!events) {
			const error = new HttpError(
				'Could not find any event for the provided user',
				404,
			);
			return next(error);
		}
		return res.status(200).json(events);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Server error!', 500);
		return next(error);
	}
};

exports.getEventById = async (req, res, next) => {
	const { eventId } = req.params;

	try {
		const event = await Event.findOne({ where: { id: eventId } });
		if (!event) {
			const error = new HttpError(
				'Could not find any event for the provided id',
				404,
			);
			return next(error);
		}
		return res.status(200).json(event);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Server error!', 500);
		return next(error);
	}
};

exports.dashboard = async (req, res, next) => {
	const { eventId } = req.params;

	try {
		const productList = await ProductList.findOne({
			where: { event_id: eventId },
		});
		let gifteds = await Gifted.findOne({
			attributes: [
				'product_list_id',
				[sequelize.fn('sum', sequelize.col('price')), 'total'],
				[sequelize.fn('sum', sequelize.col('quantity')), 'qtd'],
			],
			group: ['product_list_id'],
			where: {
				product_list_id: productList.id,
			},
		});
		let lastProduct = null;
		lastProduct = await Gifted.findOne({
			attributes: [['product_id', 'lastProduct']],
			group: ['product_id'],
			order: [[sequelize.fn('max', sequelize.col('updated_at')), 'DESC']],
			limit: 1,
		});
		if (lastProduct) {
			lastProduct = await Product.findOne({
				where: {
					id: lastProduct.getDataValue('lastProduct'),
				},
			});
		}

		let lastNoteId = await Note.findOne({
			attributes: [[sequelize.fn('max', sequelize.col('id')), 'max']],
			where: {
				event_id: eventId,
			},
		});

		let lastNote = null;
		if (lastNoteId) {
			lastNote = await Note.findOne({
				where: {
					id: lastNoteId.getDataValue('max'),
				},
				include: ['user'],
			});
		}
		return res.status(200).json({ gifteds, lastNoteId, lastNote, lastProduct });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Server error!', 500);
		return next(error);
	}
};

exports.getGiftList = async (req, res, next) => {
	const { eventId } = req.params;

	try {
		const gifts = await ProductList.findAll({
			where: { event_id: eventId },
			include: ['products'],
		});
		if (!gifts || gifts.length == 0) {
			const error = new HttpError(
				'Could not find any gifts for the provided event',
				404,
			);
			return next(error);
		}
		return res.status(200).json(gifts);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Server error!', 500);
		return next(error);
	}
};

exports.getGifteds = async (req, res, next) => {
	const { eventId } = req.params;

	try {
		const productList = await ProductList.findOne({
			where: { event_id: eventId },
		});
		const gifts = await Gifted.findAll({
			where: { product_list_id: productList.id },
			include: ['product'],
		});
		if (!gifts || gifts.length == 0) {
			const error = new HttpError(
				'Could not find any gifts for the provided event',
				404,
			);
			return next(error);
		}
		return res.status(200).json(gifts);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Server error!', 500);
		return next(error);
	}
};

exports.giveGift = async (req, res, next) => {
	const { user_id, product_list_id, products } = req.body;

	try {
		const productList = [];
		const gifts = [];
		let quantity = -1;
		let price = 0;
		if (products !== undefined && products !== null && products.length > 1) {
			for (const product of products) {
				let p = await Product.findOne({
					where: { product_list_id: product_list_id, name: product.name },
				});
				productList.push(p);
			}
		} else if (products !== undefined && products !== null) {
			let p = await Product.findOne({
				where: { product_list_id: product_list_id, name: products[0].name },
			});
			productList.push(p);
		}
		for (const product of productList) {
			const filteredProducts = products.filter((p) => {
				return p.name === product.name;
			});
			if (filteredProducts[0] !== undefined && filteredProducts[0] !== null) {
				quantity = filteredProducts[0].count;
				price = filteredProducts[0].price;
			} else {
				const err = 'Invalid quantity or price';
				throw err;
			}
			let gift = await Gifted.create({
				quantity: quantity,
				price: price,
				user_id: user_id,
				product_list_id: product_list_id,
				product_id: product.id,
			});
			const [numberOfAffectedRows, affectedRows] = await Product.update(
				{
					selected_quantity: product.selected_quantity - quantity,
				},
				{
					where: { product_list_id: product_list_id, name: product.name },
					returning: true,
					plain: true,
				},
			);
			console.log(numberOfAffectedRows);
			console.log(affectedRows);
			gifts.push(gift);
		}
		return res.status(200).json(gifts);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Server error!', 500);
		return next(error);
	}
};

exports.create = async (req, res, next) => {
	const {
		date,
		type,
		hour,
		address,
		phone,
		baby_name = '',
		baby_birthday,
		theme,
		history_text = '',
		invite_text = '',
		url,
		baby_image,
		mom_image,
		dad_image,
		background_image,
		mom_name,
		dad_name,
		products,
		product_list_name,
	} = req.body;
	const { userId } = req.params;

	try {
		const validUser = await User.findOne({ where: { id: userId } });
		if (!validUser) {
			const error = new HttpError(
				'Could not find any user for the provided ID',
				404,
			);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError(
			'Server error - not able to find any user',
			500,
		);
		return next(error);
	}

	try {
		const existed = await Event.findOne({ where: { user_id: userId } });
		if (existed) {
			const error = new HttpError('This user have a event', 400);
			return next(error);
		}

		const event = await Event.create({
			user_id: userId,
			type,
			date,
			hour,
			phone,
			address,
			baby_name,
			baby_birthday,
			mom_name,
			dad_name,
			url,
			theme,
			history_text,
			invite_text,
		});

		let baby_image_url = '';
		let mom_image_url = '';
		let dad_image_url = '';
		let background_image_url = '';

		if (baby_image) {
			baby_image_url = await imageUpload(baby_image, 'baby-image-' + event.id);
		}

		if (mom_image) {
			mom_image_url = await imageUpload(mom_image, 'mom-image-' + event.id);
		}

		if (dad_image) {
			dad_image_url = await imageUpload(dad_image, 'dad-image-' + event.id);
		}

		if (background_image) {
			background_image_url = await imageUpload(
				background_image,
				'background-image-' + event.id,
			);
		}

		event_with_images = await event.update({
			baby_image_url,
			mom_image_url,
			dad_image_url,
			background_image_url,
		});

		console.log('products', products);
		const product_list = await ProductList.create({
			name: product_list_name,
			event_id: event.id,
		});
		products.forEach(async (product) => {
			product.product_list_id = product_list.id;
			delete product.id;
			console.log('product ======== ', product);
			let p = await Product.create(product);
			console.log(p);
		});

		return res.status(200).json(event);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to save the event - server error', 500);
		return next(error);
	}
};

exports.verifyUrl = async (req, res, next) => {
	const { url } = req.params;

	try {
		const event = await Event.findOne({ where: { url: url } });
		return res.status(200).json(event ? false : true);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to verify', 500);
		return next(error);
	}
};

exports.getByUrl = async (req, res, next) => {
	const { url } = req.params;

	try {
		const event = await Event.findOne({
			where: { url: url },
			include: [
				{
					model: Note,
					as: 'notes',
					include: ['user'],
				},
				'guests',
				// 'products',
				'gallery',
			],
		});
		return res.status(200).json(event);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to verify', 500);
		return next(error);
	}
};

exports.edit = async (req, res, next) => {
	const {
		date,
		type,
		hour,
		address,
		phone,
		baby_name = '',
		baby_birthday,
		theme,
		history_text = '',
		invite_text = '',
		url,
		baby_image,
		mom_image,
		dad_image,
		background_image,
	} = req.body;

	const { eventId } = req.params;

	let event;
	try {
		event = await Event.findOne({ where: { id: eventId } });
		if (!event) {
			const error = new HttpError(
				'Could not find any event for the provided ID',
				404,
			);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to find any event - server error', 500);
		return next(error);
	}

	if (baby_image) {
		event.baby_image_url = await imageUpload(
			baby_image,
			'baby-image-' + event.id,
		);
	}

	if (mom_image) {
		event.mom_image_url = await imageUpload(mom_image, 'mom-image-' + event.id);
	}

	if (dad_image) {
		event.dad_image_url = await imageUpload(dad_image, 'dad-image-' + event.id);
	}

	if (background_image) {
		event.background_image_url = await imageUpload(
			background_image,
			'background-image-' + event.id,
		);
	}

	try {
		let updated = await event.update({
			type,
			date,
			hour,
			url,
			phone,
			address,
			baby_name,
			baby_birthday,
			theme,
			history_text,
			invite_text,
		});
		return res.status(200).json({ message: 'Event edited!', event: updated });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to save the event', 500);
		return next(error);
	}
};

exports.saveProducts = async (req, res, next) => {
	const { events_products } = req.body;

	try {
		events_products.forEach(async (e) => {
			if (e.id != null) {
				let event = await EventProduct.findOne({ where: { id: e.id } });

				if (e.selected == false) {
					await event.destroy();
				} else {
					await event.update({
						quantity: e.quantity,
					});
				}
			}
		});
		return res.status(200).json({ message: 'Edited!' });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to find any event - server error', 500);
		return next(error);
	}
};

exports.delete = async (req, res, next) => {
	const { eventId } = req.params;

	try {
		const event = await Event.findOne({
			where: {
				id: eventId,
			},
		});

		await event.destroy();
		return res.status(200).send('Event deleted');
	} catch (err) {
		console.error(err);
		const error = new HttpError('Server error!', 500);
		return next(error);
	}
};

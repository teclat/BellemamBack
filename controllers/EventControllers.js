const imageUpload = require('../middleware/image-upload');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Event = require('../models/Event');
const Gifted = require('../models/Gifted');
const EventProduct = require('../models/EventProduct');

exports.index = async (req, res, next) => {
	const { userId } = req.params;

	try {
		const events = await Event.findAll({ where: { user_id: userId } });
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

exports.getGiftList = async (req, res, next) => {
	const { eventId } = req.params;

	try {
		const gifts = await EventProduct.findAll({
			where: { event_id: eventId },
			include: ["product"]
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
		const gifts = await Gifted.findAll({
			where: { event_id: eventId },
			include: ["product"]
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
	const { event_id, user_id, product_id } = req.body;

	try {
		const gift = await Gifted.create({
			event_id, user_id, product_id
		})
		return res.status(200).json(gift);
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
		products
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
		console.log("products", products);
		const event = await Event.create({
			user_id: userId,
			type,
			date,
			hour,
			phone,
			address,
			baby_name,
			baby_birthday,
			url,
			theme,
			history_text,
			invite_text
		});

		let baby_image_url = '';
		let mom_image_url = '';
		let dad_image_url = '';
		let background_image_url = '';

		if (baby_image) {
			baby_image_url = await imageUpload(baby_image, 'baby-image-' + event.id)
		}

		if (mom_image) {
			mom_image_url = await imageUpload(mom_image, 'mom-image-' + event.id)
		}

		if (dad_image) {
			dad_image_url = await imageUpload(dad_image, 'dad-image-' + event.id)
		}

		if (background_image) {
			background_image_url = await imageUpload(background_image, 'background-image-' + event.id)
		}

		event_with_images = await event.update({
			baby_image_url,
			mom_image_url,
			dad_image_url,
			background_image_url,
		})

		products.forEach(async (product) => {
			let ep = await EventProduct.create(product);
			console.log(ep);
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
		const event = await Event.findOne({ where: { url: url } });
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
		background_image
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
		event.baby_image_url = await imageUpload(baby_image, 'baby-image-' + event.id)
	}

	if (mom_image) {
		event.mom_image_url = await imageUpload(mom_image, 'mom-image-' + event.id)
	}

	if (dad_image) {
		event.dad_image_url = await imageUpload(dad_image, 'dad-image-' + event.id)
	}

	if (background_image) {
		event.background_image_url = await imageUpload(background_image, 'background-image-' + event.id)
	}

	try {
		let updated = await event.update({
			type, date, hour, url, phone, address, baby_name, baby_birthday, theme, history_text, invite_text
		});
		return res.status(200).json({ message: 'Event edited!', event: updated });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to save the event', 500);
		return next(error);
	}
};

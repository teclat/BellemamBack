const HttpError = require('../models/http-error');
const User = require('../models/User');
const Event = require('../models/Event');
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
		products
	} = req.body;
	const { userId } = req.params;

	const baby_image_url = req.files[0].location;
	const mom_image_url = req.files[1].location;
	const dad_image_url = req.files[2].location;
	const background_image_url = req.files[3].location;

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
		let jsonproducts = JSON.parse(products);
		const event = await Event.create({
			user_id: userId,
			type,
			date,
			hour,
			phone,
			address,
			baby_name,
			baby_birthday,
			baby_image_url,
			mom_image_url,
			dad_image_url,
			background_image_url,
			theme,
			history_text,
			invite_text
		});

		jsonproducts.forEach(async (product) => {
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

exports.edit = async (req, res, next) => {
	const {
		type,
		date,
		hour,
		address,
		baby_name = '',
		baby_birthday,
		theme,
		history_text = '',
		invite_text = '',
	} = req.body;

	const { eventId } = req.params;

	const baby_image_url = req.files[0].location;
	const mom_image_url = req.files[1].location;
	const dad_image_url = req.files[2].location;
	const background_image_url = req.files[3].location;

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

	event.type = type;
	event.date = date;
	event.hour = hour;
	event.address = address;
	event.baby_name = baby_name;
	event.baby_birthday = baby_birthday;
	event.baby_image_url = baby_image_url;
	event.mom_image_url = mom_image_url;
	event.dad_image_url = dad_image_url;
	event.background_image_url = background_image_url;
	event.theme = theme;
	event.history_text = history_text;
	event.invite_text = invite_text;

	try {
		await event.save();
		return res.status(200).json({ message: 'Event edited!', event: event });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to save the event', 500);
		return next(error);
	}
};

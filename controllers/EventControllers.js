const HttpError = require('../models/http-error');
const User = require('../models/User');
const Event = require('../models/Event');

exports.create = async (req, res, next) => {
	const {
		date,
		hour,
		address,
		baby_name = null,
		baby_birthday,
		baby_image_url = null,
		mom_image_url = null,
		dad_image_url = null,
		theme,
		obs1 = null,
		obs2 = null,
		products = null,
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
		const event = await Event.create({
			date,
			hour,
			address,
			baby_name,
			baby_birthday,
			baby_image_url,
			mom_image_url,
			dad_image_url,
			theme,
			obs1,
			obs2,
			porducts,
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
		date,
		hour,
		address,
		baby_name = null,
		baby_birthday,
		baby_image_url = null,
		mom_image_url = null,
		dad_image_url = null,
		theme,
		obs1 = null,
		obs2 = null,
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

	event.date = date;
	event.hour = hour;
	event.address = address;
	event.baby_name = baby_name;
	event.baby_birthday = baby_birthday;
	event.baby_image_url = baby_image_url;
	event.mom_image_url = mom_image_url;
	event.dad_image_url = dad_image_url;
	event.theme = theme;
	event.obs1 = obs1;
	event.obs2 = obs2;

	try {
		await event.save();
		return res.status(200).json({ message: 'Event edited!', event: event });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to save the event', 500);
		return next(error);
	}
};

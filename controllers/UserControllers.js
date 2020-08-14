const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const HttpError = require('../models/http-error');
const imageUpload = require('../middleware/image-upload');

const User = require('../models/User');
const EventGuest = require('../models/EventGuest');
const Event = require('../models/Event');

exports.create = async (req, res, next) => {
	const {
		name,
		email,
		password,
		role,
		phone,
		relationship,
		image,
		city = '',
		state = '',
		events = [''],
	} = req.body;

	try {
		const checkUser = await User.findOne({ where: { email: email } });
		if (checkUser) {
			const error = new HttpError('User already exists', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user check DB', 500);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		console.error(err);
		const error = new HttpError(
			'Could not create user, try again later.(hash error)',
			500,
		);
		return next(error);
	}

	try {
		const createdUser = await User.create({
			name,
			email,
			password: hashedPassword,
			relationship,
			role,
			phone,
			city,
			state,
			events,
		});

		image_url = await imageUpload(image, 'user-' + createdUser.id);
		with_image = await createdUser.update({
			image_url
		})
		createdUser.password = undefined;

		return res.status(200).json(with_image);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create user failed (save)', 500);
		return next(error);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	let user;
	try {
		user = await User.scope("withPassword").findOne({ where: { email: email } });
		if (!user) {
			const error = new HttpError('Login failed, invalid credentials', 403);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError(
			'Login failed, unable to reach the server',
			500,
		);
		return next(error);
	}

	try {
		let isValidPass = false;
		console.log("user", user);
		isValidPass = await bcrypt.compare(password, user.password);

		if (!isValidPass) {
			const error = new HttpError('Login failed, invalid credentials', 401);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Bcrypt function error', 500);
		return next(error);
	}

	try {
		const token = jwt.sign(
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_KEY,
			{ expiresIn: '12h' },
		);
		return res.status(200).json({
			userName: user.name,
			role: user.role,
			id: user.id,
			email: user.email,
			token: token,
		});
	} catch (err) {
		console.error(err);
		const error = new HttpError('Login failed, JWT', 500);
		return next(error);
	}
};

exports.get = async (req, res, next) => {
	const {
		userId
	} = req.params;

	let user = null;
	try {
		user = await User.findOne({ where: { id: userId } });
		if (!user) {
			const error = new HttpError('User not exist', 400);
			return next(error);
		}
		return res.status(200).json(user);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user check DB', 500);
		return next(error);
	}
};

exports.update = async (req, res, next) => {
	const {
		name,
		email,
		phone,
		relationship,
		city = '',
		state = '',
		image
	} = req.body;

	let checkUser = null;
	try {
		checkUser = await User.findOne({ where: { email: email } });
		if (!checkUser) {
			const error = new HttpError('User not exists', 400);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user check DB', 500);
		return next(error);
	}

	try {
		let url = "";
		if (image) {
			url = await imageUpload(image, 'user-' + checkUser.id);
			console.log("url", url)
		}
		const updatedUser = await checkUser.update({
			name,
			relationship,
			phone,
			city,
			state,
			image_url: url !== "" ? url : checkUser.image_url
		});

		updatedUser.password = undefined;
		return res.status(200).json(updatedUser);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Update user failed (save)', 500);
		return next(error);
	}
};

exports.subscribeToEvent = async (req, res, next) => {
	const {
		event_id,
		user_id,
	} = req.body;

	try {
		const checkEventGuest = await EventGuest.findOne({ where: { event_id: event_id, user_id: user_id } });
		if (checkEventGuest) {
			const error = new HttpError('Already subscribed', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user check DB', 500);
		return next(error);
	}

	try {
		const eventGuest = await EventGuest.create({
			event_id,
			user_id,
		});

		return res.status(200).json(eventGuest);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Subscribed failed (save)', 400);
		return next(error);
	}
};

exports.subscribedEvents = async (req, res, next) => {
	const {
		user_id,
	} = req.body;

	try {
		const events = await EventGuest.findAll({
			where: {
				user_id: user_id,
			},
			include: [{ model: Event, as: "event" }]
		});

		return res.status(200).json(events);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Get subscribed events failed', 400);
		return next(error);
	}
};

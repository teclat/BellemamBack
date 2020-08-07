const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const HttpError = require('../models/http-error');

const User = require('../models/User');

exports.create = async (req, res, next) => {
	const {
		name,
		email,
		password,
		role,
		phone,
		relationship,
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

		createdUser.password = undefined;
		return res.status(200).json(createdUser);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create user failed (save)', 500);
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
		events = [''],
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
		const updatedUser = await checkUser.update({
			name,
			email,
			relationship,
			phone,
			city,
			state,
			events,
		});

		updatedUser.password = undefined;
		return res.status(200).json(updatedUser);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Update user failed (save)', 500);
		return next(error);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	let user;
	try {
		user = await User.findOne({ where: { email: email } });
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
		return res.status(201).json({
			userName: user.name,
			role: user.role,
			userId: user.id,
			email: user.email,
			token: token,
		});
	} catch (err) {
		console.error(err);
		const error = new HttpError('Login failed, JWT', 500);
		return next(error);
	}
};

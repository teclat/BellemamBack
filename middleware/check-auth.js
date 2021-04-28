const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	try {
		const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			const error = new HttpError('Authentication failed! !token', 403);
			return next(error);
		}

		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		req.userData = { userId: decodedToken.userId, userRole: decodedToken.role };
		next();
	} catch (err) {
		const error = new HttpError('Server error, authentication failed!', 500);
		return next(error);
	}
};

const axios = require('axios');
const Product = require('../models/Product');
const HttpError = require('../models/http-error');
const imageUpload = require('../middleware/image-upload');

exports.index = async (req, res, next) => {
	let xwpTotalPages;
	let xwpTotal;

	const config = {
		params: req.query,
		auth: {
			username: process.env.CONSUMER_KEY_WP,
			password: process.env.CONSUMER_SECRET_WP,
		},
	};

	const response = await axios
		.get(`https://bellemam.com.br/wp-json/wc/v3/products`, config)
		.then((response) => {
			xwpTotalPages = response.headers['x-wp-totalpages'];
			xwpTotal = response.headers['x-wp-total'];
			return response.data;
		})
		.catch((err) => {
			console.log(err);
			return err;
		});

	res.setHeader('Access-Control-Expose-Headers', 'x-wp-totalpages');
	res.setHeader('x-wp-totalpages', xwpTotalPages);
	res.setHeader('x-wp-total', xwpTotal);

	return res.status(200).json(response);
};

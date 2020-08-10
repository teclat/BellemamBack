const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const productRoutes = require('./routes/productRoutes');
const noteRoutes = require('./routes/noteRoutes');

require('./database');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notes', noteRoutes);

//error middleware
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}

	res.status(error.code || 500);
	res.json({
		message: error.message || 'An unknown error occurred! (api routes) ',
	});
});

module.exports = app;

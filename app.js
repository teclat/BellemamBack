const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const productRoutes = require('./routes/productRoutes');
const noteRoutes = require('./routes/noteRoutes');
const customRoutes = require('./routes/customRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

require('./database');

const app = express();

// app.use(express.bodyParser({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/custom', customRoutes);

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

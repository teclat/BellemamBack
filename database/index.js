const Sequelize = require('sequelize');
const dbconfig = require('./config/database');

const User = require('../models/User');
const Event = require('../models/Event');
const Product = require('../models/Product');

const connection = new Sequelize(dbconfig);

User.init(connection);
Event.init(connection);
Product.init(connection);

User.associate(connection.models);
Event.associate(connection.models);
Product.associate(connection.models);

module.exports = connection;

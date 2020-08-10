const Sequelize = require('sequelize');
const dbconfig = require('./config/database');

const User = require('../models/User');
const Event = require('../models/Event');
const Product = require('../models/Product');
const EventGuest = require('../models/EventGuest');
const EventProduct = require('../models/EventProduct');
const Note = require('../models/Note');

const connection = new Sequelize(dbconfig);

User.init(connection);
Event.init(connection);
Product.init(connection);
EventGuest.init(connection);
EventProduct.init(connection);
Note.init(connection);

User.associate(connection.models);
Event.associate(connection.models);
Product.associate(connection.models);
EventGuest.associate(connection.models);
EventProduct.associate(connection.models);
Note.associate(connection.models);

module.exports = connection;

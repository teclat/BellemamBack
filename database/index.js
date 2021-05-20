const Sequelize = require('sequelize');
const dbconfig = require('./config/database');

const User = require('../models/User');
const Event = require('../models/Event');
const Product = require('../models/Product');
const EventGuest = require('../models/EventGuest');
const EventProduct = require('../models/EventProduct');
const Note = require('../models/Note');
const Gifted = require('../models/Gifted');
const CustomWebsite = require('../models/CustomWebsite');
const Gallery = require('../models/Gallery');
const ProductList = require('../models/ProductList');

const connection = new Sequelize(dbconfig);

User.init(connection);
Event.init(connection);
Product.init(connection);
EventGuest.init(connection);
EventProduct.init(connection);
Note.init(connection);
Gifted.init(connection);
CustomWebsite.init(connection);
Gallery.init(connection);

ProductList.init(connection);

User.associate(connection.models);
Event.associate(connection.models);
Product.associate(connection.models);
EventGuest.associate(connection.models);
EventProduct.associate(connection.models);
Note.associate(connection.models);
Gifted.associate(connection.models);
CustomWebsite.associate(connection.models);
Gallery.associate(connection.models);

ProductList.associate(connection.models);

module.exports = connection;

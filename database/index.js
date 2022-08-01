const Sequelize = require('sequelize');
const database = require('~/config/database');

// const User = require('../models/User');

const connection = new Sequelize(database);

// User.init(connection);

// User.associate(connection.models);

module.exports = connection;

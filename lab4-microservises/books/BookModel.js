const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  year: DataTypes.INTEGER
});

module.exports = { sequelize, Book };
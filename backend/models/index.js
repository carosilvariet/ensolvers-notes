'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Initialize models with sequelize instance
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelImport = require(path.join(__dirname, file));
    const model = modelImport(sequelize, Sequelize.DataTypes);
db[model.name] = model;
  });

// Define the relationship between Note and Category here
const Note = db.Note;
const Category = db.Category;

Note.belongsToMany(Category, { through: 'NoteCategories' });
Category.belongsToMany(Note, { through: 'NoteCategories' });

// Synchronize the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully!');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

// Associate models after they have been initialized
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize and Sequelize to db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
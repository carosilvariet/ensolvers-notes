'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category', 
      });
    }
  }

  Note.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Note',
      tableName: 'Notes', 
      underscored: true,
    }
  );

  return Note; 
};
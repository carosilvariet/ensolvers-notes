'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NoteCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      noteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Notes',
          key: 'id',
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories', 
          key: 'id',
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE', 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NoteCategories'); 
  },
};

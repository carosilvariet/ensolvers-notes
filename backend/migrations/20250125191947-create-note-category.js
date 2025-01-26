// migrations/[timestamp]-create-note-category.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NoteCategory', {
      noteId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Notes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      // Otros campos si es necesario
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NoteCategory');
  },
};
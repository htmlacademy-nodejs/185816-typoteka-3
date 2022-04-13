'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable(`comments`, {
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      publicationId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable(`comments`);
  }
};

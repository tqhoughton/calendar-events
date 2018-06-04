'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CalendarEventUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      calendarEventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'CalendarEvents',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(() => {
      return queryInterface.addIndex('CalendarEventUsers', {
        unique: true,
        fields: ['userId', 'calendarEventId']
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CalendarEventUsers');
  }
};
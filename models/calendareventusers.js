'use strict';
module.exports = (sequelize, DataTypes) => {
  var CalendarEventUsers = sequelize.define('CalendarEventUsers', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    calendarEventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'CalendarEvents',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  }, {
    indexes: [
      {
          unique: true,
          fields: ['userId', 'calendarEventId']
      }
    ]
  });
  CalendarEventUsers.associate = function(models) {
    // associations can be defined here
  };
  return CalendarEventUsers;
};
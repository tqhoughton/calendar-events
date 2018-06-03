'use strict';
module.exports = (sequelize, DataTypes) => {
  var CalendarEvent = sequelize.define('CalendarEvent', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    rRuleSet: DataTypes.STRING,
    startAt: DataTypes.DATE,
    endAt: DataTypes.DATE
  }, {});
  CalendarEvent.associate = function(models) {
    // associations can be defined here
    CalendarEvent.hasMany(models.CalendarEventUsers)
  };
  return CalendarEvent;
};
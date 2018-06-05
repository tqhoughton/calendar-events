'use strict';

const moment = require('moment-timezone')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Users', [{
      firstName: 'Bob',
      lastName: 'Saget',
      email: 'bob@saget.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'bruce@wayne.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    .then(() => {
      return queryInterface.bulkInsert('CalendarEvents', [{
        name: 'Office Meeting',
        description: 'We need to discuss TPS reports.',
        timeZone: 'America/Denver',
        startAt: new Date('June 1, 2018 03:24:00'),
        endAt: new Date('June 3, 2018 09:11:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'Monday Stand-up',
        description: 'This is our monday morning standup.',
        timeZone: 'America/Phoenix',
        startAt: moment.tz("2018-06-05 12:00", "America/Phoenix").toDate(),
        endAt: moment.tz("2018-06-05 13:00", "America/Phoenix").toDate(),
        rRuleSet: 'RRULE:FREQ=MONTHLY;DTSTART=20180606T000000Z;COUNT=30;WKST=MO;BYDAY=MO;BYSETPOS=1;BYHOUR=12',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'Monday Stand-up (NY Team)',
        description: 'This is our monday morning standup. But we\'re in New York, so it\'s a lot cooler.',
        timeZone: 'America/New_York',
        startAt: moment.tz("2018-06-05 12:00", "America/New_York").toDate(),
        endAt: moment.tz("2018-06-05 13:00", "America/New_York").toDate(),
        rRuleSet: 'RRULE:FREQ=MONTHLY;DTSTART=20180606T000000Z;COUNT=30;WKST=MO;BYDAY=MO;BYSETPOS=1;BYHOUR=12',
        createdAt: new Date(),
        updatedAt: new Date()
      }])
    })
    .then(() => {
      return queryInterface.bulkInsert('CalendarEventUsers', [{
        userId: 1,
        calendarEventId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        userId: 2,
        calendarEventId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        userId: 1,
        calendarEventId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        calendarEventId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

    // return queryInterface.bulkDelete('CalendarEventUsers', {})
    // .then(() => queryInterface.dropTable('Users', null, {}))
    // .then(() => queryInterface.dropTable('CalendarEvents', null, {}))

    return queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0;`)
    .then(() => queryInterface.sequelize.query(`TRUNCATE TABLE CalendarEventUsers;`))
    .then(() => queryInterface.sequelize.query(`TRUNCATE TABLE CalendarEvents;`))
    .then(() => queryInterface.sequelize.query(`TRUNCATE TABLE Users;`))
    .then(() => queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1;`))
  }
};

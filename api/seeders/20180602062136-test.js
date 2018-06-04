'use strict';

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
        timeZone: 'America/Denver',
        startAt: new Date('June 4, 2018 12:00:00'),
        endAt: new Date('June 4, 2018 13:00:00'),
        rRuleSet: 'RRULE:FREQ=WEEKLY;DTSTART=20180606T000000Z;WKST=MO;BYHOUR=18',
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

    return queryInterface.bulkDelete('Users', null, {})
    .then(() => queryInterface.bulkDelete('CalendarEvents', null, {}))
  }
};

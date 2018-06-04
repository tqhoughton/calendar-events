const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      db = require('./models'),
      rruleset = require('rrule').rruleset,
      rrulestr = require('rrule').rrulestr,
      Op = require('sequelize').Op,
      moment = require('moment-timezone')

const port = 8000
const app = express()

function getOccurrances(rRuleSetStr, timeZone, start, end) {
  const ruleSet = rrulestr(rRuleSetStr)

  const serverTimezone = moment.tz.zone('UTC')
  const targetTimezone = moment.tz.zone(timeZone)

  const dates = ruleSet.between(start, end)
  const convertedDates = dates.map(date => {
    const offset = targetTimezone.offset(date) - serverTimezone.offset(date);
    console.log('offset is: ', offset)
    // return moment(date).add(offset, 'minutes').toDate()
    return moment(date).toDate()
  });

  return convertedDates
}

app.use(bodyParser.json())
app.use(cors())

app.get('/users', (req, res) => {
  db.User.findAll().then(users => res.send(users))
})

app.get('/users/:id/calendar-events', (req, res) => {
  console.log('req.query: ', req.query)
  const start = new Date(parseInt(req.query.start) || new Date())
  const end = new Date(parseInt(req.query.end) || new Date().setDate(start.getDate()+1))

  const params = {
    where: {
      [Op.or]: [{
        rRuleSet: {
          [Op.ne]: null
        },
        startAt: {
          [Op.lte]: end
        }
      },
      {
        startAt: {
          [Op.lte]: end
        },
        endAt: {
          [Op.gte]: start
        }
      }]
    },
    include: [{
      model: db.CalendarEventUsers,
      where: {
        userId: req.params.id
      }
    }]
  }
  
  db.CalendarEvent.findAll(params).then(events => {
    events = events.map(event => event.get({ plain: true }))
    for (let event of events) {
      delete event.CalendarEventUsers
    }
    // compute to see if recurring events fall under date range
    events.forEach(event => {
      const rRuleSet = event.rRuleSet
      const timeZone = event.timeZone
      
      if (rRuleSet) {
        const occurrances = getOccurrances(rRuleSet, timeZone, start, end)
        event.occurrances = occurrances
      }
    })

    events = events.filter(event => !event.rRuleSet || event.occurrances.length)
    return res.send(events)
  })
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
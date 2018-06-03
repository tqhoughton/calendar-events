const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      db = require('./models'),
      rruleset = require('rrule').rruleset,
      rrulestr = require('rrule').rrulestr
      Op = require('sequelize').Op

const port = 8000
const app = express()

function getOccurrances(rRuleSetStr, start, end) {
  const ruleSet = rrulestr(rRuleSetStr)
  const occurrances = ruleSet.between(start, end)
  occurrances.forEach(i => console.log(i.toLocaleString()))
  return occurrances.length;
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
    const rRuleSets = new Set(
      events.map(event => event.rRuleSet)
      .filter(i => (i))
    )
    rRuleSets.forEach(rRuleSet => {
      if (!getOccurrances(rRuleSet, start, end)) {
        rRuleSets.delete(rRuleSet)
      }
    })
    console.log('rulesets are: ', rRuleSets)
    events = events.filter(event => {
      return (!event.rRuleSet || rRuleSets.has(event.rRuleSet))
    })
    return res.send(events)
  })
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
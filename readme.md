# Calendar Events Demo

### About

This repo is an example project to show how timezone-specific recurring events in a relational database can be stored and queried.

This repo has a sample MySQL database using Sequelize for the ORM and CLI, as well as a simple express application that has 2 endpoints: `/users` and `/users/calendar-events`. The latter endpoint takes a starting date and an ending date, and using the `rRuleSet` column in CalendarEvents can compute all of the occurrances of that event between those dates.

Recurring events is a concept that seems really simple at first glance. However, if you investigate the problem at all, you will quickly find that creating a database model that handles recurring events, exceptions to those events, and all CRUD-related aspects of managing them will make you want to pull your hair out.

Luckily, a lot of people before me have come across this problem. The people behind iCalendar.org created a syntax for defining recurring events called [rrule](https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html) and using libraries like [this](https://github.com/jakubroztocil/rrule) we can define recurring events using rRules and rRuleSets. When we want to store recurring events in our database, we can store the collection of rules as a string column and use that data to compute future events. So nifty!

Unfortunately, generating these events is not as simple as you may think. While the `rrule` library contains a `between()` method that takes in 2 dates and spits out occurrances of that rule between those dates, it does so using the server timezone. This is a problem when factoring in things like Daylight Savings, because events generated in regions with DST will follow slightly different rules than events generated in regions without it.

Here's an example:

George lives in Phoenix, Arizona. He creates an event that is set to happen on the 1st of each month at 9am. He sends his request to the server, and it appears to have worked. However, upon further inspection, he notices that from April to October, the event he created is showing up 1 hour earlier than it should at 8am! How could this happen?!?!

The problem is different regions respecting DST differently. In this case, our server is the `America/Denver` region, while George is in the `America/Phoenix` region. When George sends his recurring event to the server, it is sent as an rRule string. The server then takes this rrule string, and creates a bunch of events that follow that rrule. However, it is doing so based on the *server's* timezone, which in this case is `America/Denver` which has Daylight Savings for 4 months out of the year. So the server creates the events as if the user was in a region that uses DST, and sends those occurrances back to George.

What is the solution?

We could set our server timezone to `America/Phoenix`, however then we would have problems with events generated in regions *with* DST. So clearly, we need a more robust solution.

The solution is that we create an event, we also need to send the user's timezone information with the request, which in this case is `America/Phoenix` timezone. Then on the server, we use the `moment-timezone` library to compute what the actual dates in the user's timezone would be. Then, we return those occurances as a UTC date so that anyone can use them.

### Downsides

There is one issue with this model, and that is the fact that under this model, there is no way (at least that I know of) to query CalendarEvents and get ONLY events that fall under the date range specified. Because of the nature of recurring events, it is impossible to know if an event that has already happened at least once will fit in the date range specified. To get all events in a certain timeframe, we have to get ALL recurring events, then filter those results using the `rrule` library, and then send the events that have occurrances within that range. However, I find this a reasonable trade-off compared to the amount of complexity you would have to maintain to be able to query for events only in the timeframe. Just know that the more recurring events your users define, the more entries in the database are going to be returned, and that means more events to filter through.

You could "fix" this problem by taking the occurrances generated and populating a table with that information, but then you've created more work for yourself when you need to delete or update a recurring event.

### Benefits

You will find, however, that this model can easily support complex event types, like events that happen on every 3rd Tuesday and every 2nd Wednesday of every month, except on holidays, in which case they happen on the week after. This is all possible to define using rRule sets, which allow you to define multiple rRules and multiple exception dates and inclusion dates. Your only limit is your knowledge of the rRule syntax. You can mess around with [this demo](https://jakubroztocil.github.io/rrule/) to get an idea of how rRules work.

### Conclusion

This was a very fun and challenging problem to solve, and if you find this, I hope it provides some utility to you.
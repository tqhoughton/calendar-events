<template>
  <div id="app">
    <h1>Calendar</h1>
    <app-calendar :events="events"></app-calendar>
  </div>
</template>

<script>
import { FullCalendar } from 'vue-full-calendar'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      events: []
    }
  },
  components: {
    appCalendar: FullCalendar
  },
  methods: {
    loadEvents(start = new Date().getTime(), end = new Date().getTime() + 1000 * 60 * 60 * 24 * 31 ) {
      this.$http.get('http://127.0.0.1:8000/users/1/calendar-events', { params: { start, end }})
      .then(data => {
        console.log('data is: ', data)
      })
    }
  },
  created() {
    this.loadEvents()
  }
}
</script>

<style lang="scss">
@import '~fullcalendar/dist/fullcalendar.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

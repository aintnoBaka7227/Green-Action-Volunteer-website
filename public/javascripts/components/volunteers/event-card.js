// eslint-disable-next-line no-undef
var eventCard = Vue.component('event-card', {
  template: `
    <div class="event-card">
        <div class="event-first-line">
            <a href="/events/example.html" class="event-title">{{ eventName }}</a>
            <div class="date">{{ eventDate }}</div>
        </div>
        <div class="text-container">
            <div class="text-block">
                {{ eventDescription }}
            </div>
        </div>
        <hr style="border: 1px solid black; color: black; margin-bottom: 25px;">
    </div>
  `,
  props: {
    eventName: {
      type: String,
      required: false
    },
    eventDate: {
      type: String,
      required: false,
      default: ""
    },
    eventDescription: {
      type: String,
      required: true
    }
  }
});

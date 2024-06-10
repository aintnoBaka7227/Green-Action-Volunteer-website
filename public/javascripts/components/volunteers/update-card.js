// EventUpdateCard.js
var EventUpdateCard = Vue.component('event-update-card', {
  template: `
    <div class="announcement-card">
      <hr>
      <div class="announcement-first-line">
        <a class="announcement-title">
          {{ title }}
        </a>
        <div class="announcement-event-name">{{ location }}: {{ name }}</div>
      </div>
      <div class="announcement-second-line">
        <div class="announcement-sub">
          {{ content }}
        </div>
        <div class="announcement-date">{{ date }}</div>
      </div>
    </div>
  `,
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  }
});

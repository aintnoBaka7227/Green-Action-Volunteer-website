var rsvpCard = Vue.component('rsvp-card', {
  template: `
    <div class="event-card">
      <div class="event-first-line">
          <a href="/events/example.html" class="event-title"> {{ eventName }} </a>
          <div class="date"> {{ eventDate }} </div>
      </div>
      <div class="text-container">
          <div class="text-block">
              {{ eventDescription }}
          </div>
      </div>
      <div class="event-rsvp">
          <div class="event-rsvp-text">Are you coming?</div>
      <div class="event-rsvp-buttons">
          <button type="button" class="event-rsvp-yes" @click="rsvpYes">Yes</button>
          <button type="button" class="event-rsvp-no">No</button>
      </div>
      </div>
      <hr style="border: 1px solid black; color: black; margin-bottom: 25px;">
    </div>
  `,
  props: {
    eventName: {
      type: String,
      required: true
    },
    eventDate: {
      type: String,
      required: true
    },
    eventDescription: {
      type: String,
      required: true
    },
    eventId: {
      type: Number,
      required: true
    }
  },
  methods: {
    rsvpYes() {
      this.$emit('rsvp', { event_id: this.eventId, volunteerId: this.userVolunteerId });
  }

  }
});
var myEventsCard = Vue.component('my-events-card', {
  template: `
    <div class="event-card">
      <div class="event-first-line">
          <a href="/events/example.html" class="event-title"> {{ eventName }} </a>
          <div class="date"> {{ eventDate }}</div>
      </div>
      <div class="text-container">
          <div class="text-block">
              {{ eventDescription }}
          </div>
      </div>
      <div class="event-card-buttons">
          <button type="button" class="event-resign" @click="resign">Resign from this event</button>
          <a href="/events/example.html" class="event-learn-more">Learn more</a>
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
    },
    volunteerId: {
      type: Number,
      required: true
    }
  },
  methods: {
    resign() {
      fetch('/volunteers/resign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ volunteerId: this.volunteerId, eventId: this.eventId })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          location.reload(); // Reload the page on successful resignation
        } else {
          alert('Failed to resign from the event.');
        }
      })
      .catch(error => {
        console.error('Error resigning from event:', error);
      });
    }
  }
});

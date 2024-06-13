// eslint-disable-next-line no-undef
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
          <a href="#" class="event-learn-more">Learn more</a>
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
      const xhr = new XMLHttpRequest();
      const url = '/volunteers/resign';
      xhr.open('POST', url, true);

      // Set headers
      xhr.setRequestHeader('Content-Type', 'application/json');

      // Prepare request body
      const requestBody = JSON.stringify({
        volunteerId: this.volunteerId,
        eventId: this.eventId
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success) {
                location.reload(); // Reload the page on successful resignation
              } else {
                alert('Failed to resign from the event.');
              }
            } catch (error) {
              console.error('Error parsing JSON response', error);
            }
          } else {
            console.error('Error resigning from event. Status:', xhr.status);
          }
        }
      };

      xhr.send(requestBody);
    }

  }
});

var managerEventCard = Vue.component('manager-event-card', {
    template: `
        <div class="event-card">
            <img src="../assets/event.png" alt="event" class="event-image">
            <div class="event-content">
                <h2>{{ eventName }}</h2>
                <small>{{ date }}, {{ address }}, {{ city }}, {{ state }} {{ postcode }}</small>
                <p>{{ eventContent }}</p>
                <div class="button-container">
                    <a href="#" class="read-more-button">View attendees</a>
                    <button @click="deleteEvent(eventId)" class="delete-button">Delete</button>
                </div>
            </div>
        </div>
    `,
    props: {
        eventName: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postcode: {
            type: String,
            required: true
        },
        eventContent: {
            type: String,
            required: true
        },
        eventId: {
            type: Number,
            required: true
        }
    },
    methods: {
        deleteEvent(eventId) {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/managers/deleteEvent/${eventId}`, true);

            xhr.onreadystatechange = () => {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.$emit('event-deleted');
                } else {
                  console.error('Failed to delete event');
                }
              }
            };

            xhr.onerror = () => {
              console.error('Error:', xhr.statusText);
            };

            xhr.send();
        },
    }
});
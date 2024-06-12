var addEventModal = Vue.component('add-event-modal', {
    template: `
        <div v-if="showModal" class="modal">
            <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2>Create New Event</h2>
            <form @submit.prevent="submitNewEvent">
                <div>
                <label for="event-name">Event Name:</label>
                <input id="event-name" v-model="eventName" type="text" required>
                </div>
                <div>
                <label for="event-date">Event Date:</label>
                <input id="event-date" v-model="eventDate" type="date" required>
                </div>
                <div>
                <label for="event-address">Street Address:</label>
                <input id="event-address" v-model="eventAddress" type="text" required>
                </div>
                <div>
                <label for="city">City:</label>
                <input id="city" v-model="city" type="text" required>
                </div>
                <div>
                <label for="state">State:</label>
                <input id="state" v-model="state" type="text" required>
                </div>
                <div>
                <label for="postcode">Postcode:</label>
                <input id="postcode" v-model="postcode" type="text" required>
                </div>
                <div>
                <label for="event-content">Content:</label>
                <textarea id="event-content" v-model="eventContent" rows="8" type="text" required></textarea>
                </div>
                <button type="submit">Create Event</button>
            </form>
            </div>
        </div>
    `,
    data() {
        return {
            showModal: false,
            eventName: '',
            eventDate: '',
            eventAddress: '',
            city: '',
            state: '',
            postcode: '',
            eventContent: '',
        };
    },
    methods: {
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.eventName = '';
            this.eventDate = '';
            this.eventAddress = '';
            this.city = '';
            this.state = '';
            this.postcode = '';
            this.eventContent = '';
        },
        submitNewEvent() {
            const eventData = {
              event_type: this.eventName,
              date: this.eventDate,
              street_address: this.eventAddress,
              city: this.city,
              state: this.state,
              postcode: this.postcode,
              content: this.eventContent
            };

            const xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/managers/createEvent', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.onreadystatechange = () => {
              if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                  this.closeModal();
                  this.$emit('eventCreated');
                } else {
                  console.error('Failed to create event');
                }
              }
            };

            xhttp.onerror = () => {
              console.error('An error occurred during the request');
            };

            xhttp.send(JSON.stringify(eventData));
        }
    }
})
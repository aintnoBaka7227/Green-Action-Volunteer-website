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
                <label for="event-date">Date:</label>
                <input id="event-date" v-model="eventDate" type="date" required>
                </div>
                <div>
                <label for="time">Time:</label>
                <input id="time" v-model="time" type="time" required>
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
                <select id="state" v-model="state" required class="styled-select">
                    <option value="" disabled>Select a state</option>
                    <option value="SA">SA</option>
                    <option value="VIC">VIC</option>
                    <option value="NSW">NSW</option>
                </select>
                </div>
                <div>
                <label for="postcode">Postcode:</label>
                <input id="postcode" v-model="postcode" type="text" required>
                </div>
                <div>
                <label for="event-content">Content:</label>
                <textarea id="event-content" v-model="eventContent" rows="8" type="text" required></textarea>
                </div>
                <div>
                    <label>Visibility:</label>
                    <input type="radio" id="public" value="1" v-model="visibility" name="visibility" required>
                    <label for="public">Public</label>
                    <input type="radio" id="private" value="0" v-model="visibility" name="visibility" required>
                    <label for="private">Private</label>
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
            time: '',
            eventAddress: '',
            city: '',
            state: '',
            postcode: '',
            eventContent: '',
            visibility: '1'
        };
    },
    computed: {
        branch_id() {
            switch (this.state) {
                case 'SA':
                    return 1;
                case 'VIC':
                    return 2;
                case 'NSW':
                    return 3;
                default:
                    return null;
            }
        }
    },
    methods: {
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.eventName = '';
            this.eventDate = '';
            this.time = '';
            this.eventAddress = '';
            this.city = '';
            this.state = '';
            this.postcode = '';
            this.eventContent = '';
            this.visibility = '1';
        },
        submitNewEvent() {
            const eventData = {
                event_type: this.eventName,
                date: this.eventDate,
                time: this.time,
                street_address: this.eventAddress,
                city: this.city,
                state: this.state,
                postcode: this.postcode,
                content: this.eventContent,
                is_public: this.visibility,
                branch_id: this.branch_id
            };

            const xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/managers/createEvent', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.onreadystatechange = () => {
              if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                  this.closeModal();
                  this.$emit('event-created');
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
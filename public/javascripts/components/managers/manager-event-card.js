var managerEventCard = Vue.component('manager-event-card', {
    template: `
        <div class="event-card">
            <img src="../assets/event.png" alt="event" class="event-image">
            <div class="event-content">
                <h2>{{ eventName }}</h2>
                <small>{{ date }}, {{ address }}, {{ city }}, {{ state }} {{ postcode }}</small>
                <p>{{ eventContent }}</p>
                <div class="button-container">
                    <a href="#" class="read-more-button">Read more</a>
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
        }
    }
});
// eslint-disable-next-line no-undef
var guestEventCard = Vue.component('guest-event-card', {
    template: `
        <div class="event-card">
            <img :src="imageUrl" :alt="imageAlt" class="event-image">
            <div class="event-content">
                <div>
                    <h2>{{ eventName }}</h2>
                    <p>{{ eventDescription }}</p>
                </div>
                <a :href="readMoreLink" class="read-more-button">{{ readMoreText }}</a>
            </div>
        </div>
    `,
    props: {
        imageUrl: {
            type: String,
            required: true
        },
        imageAlt: {
            type: String,
            default: 'Event Image'
        },
        eventName: {
            type: String,
            required: true
        },
        eventDescription: {
            type: String,
            required: true
        },
        readMoreLink: {
            type: String,
            default: '#'
        },
        readMoreText: {
            type: String,
            default: 'Read more'
        }
    }
});
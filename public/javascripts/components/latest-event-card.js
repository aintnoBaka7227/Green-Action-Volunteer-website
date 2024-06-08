// eslint-disable-next-line no-undef
var latestEventCard = Vue.component('latest-event-card', {
    props: ['eventName', 'eventDescription', 'buttonText', 'imageUrl'],
    template: `
        <div class="latest-events-card">
            <img :src="imageUrl" alt="Description of the image">
            <div>
                <h2>{{ eventName }}</h2>
                <p>{{ eventDescription }}</p>
                <div><button type="button" class="green-trans-button">{{ buttonText }}</button></div>
            </div>
        </div>
    `
});
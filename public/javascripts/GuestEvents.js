new Vue({
    el: '#app',
    data: {
        events: []
    },
    created() {
        this.fetchEvents();
    },
    methods: {
        fetchEvents() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/getPublicEvents', true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    this.events = JSON.parse(xhr.responseText);
                    console.log('Fetched events:', this.events);
                }
            };
            xhr.send();
        }
    }
});

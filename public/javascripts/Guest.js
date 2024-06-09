window.onload = function () {
    // eslint-disable-next-line no-undef
    new Vue({
        el: '#app',
        data: {
            events: [],
            updates: []
        },
        created() {
            this.fetchEvents();
            this.fetchUpdates();
        },
        methods: {
            fetchEvents() {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '/getPublicEvents', true);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this.events = JSON.parse(xhr.responseText);
                    }
                };
                xhr.send();
            },
            fetchUpdates() {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '/getPublicUpdates', true);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this.updates = JSON.parse(xhr.responseText);
                    }
                };
                xhr.send();
            }
        }
    });
};
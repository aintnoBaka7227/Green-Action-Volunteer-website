window.onload = function () {
    new Vue({
        el: '#app',
        data: {
            events: [],
            updates: [],
            branch: 'SA'
        },
        created() {
            this.fetchEvents(this.branch);
            this.fetchUpdates();
        },
        methods: {
            fetchEvents(branch) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `/getPublicEvents?branch=${branch}`, true);
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
}
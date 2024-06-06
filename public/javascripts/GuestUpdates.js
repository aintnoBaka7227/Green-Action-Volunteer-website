new Vue({
    el: '#app',
    data: {
        updates: []
    },
    created() {
        this.fetchUpdates();
    },
    methods: {
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

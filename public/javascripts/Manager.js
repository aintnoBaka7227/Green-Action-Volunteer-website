// load toogle for profile pics
document.addEventListener("DOMContentLoaded", function() {
    const dropdownToggle = document.querySelector(".dropdown-toggle");

    dropdownToggle.addEventListener("click", function() {
        const dropdown = this.parentNode;
        dropdown.classList.toggle("show");
    });

    document.addEventListener("click", function(event) {
        if (!event.target.closest(".dropdown")) {
        const dropdowns = document.querySelectorAll(".dropdown");
        dropdowns.forEach(function(dropdown) {
            dropdown.classList.remove("show");
        });
        }
    });
});

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
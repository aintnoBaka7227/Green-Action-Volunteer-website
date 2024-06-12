// eslint-disable-next-line no-undef
new Vue({
    el: '#app',
    data: {
        events: [],
        updates: [],
        searchQuery: '',
        sortOption: 'newest',
        filterOption: 'all'
    },
    computed: {
        sortedEvents() {
            let filtered = this.events;
            if (this.filterOption === 'public') {
                filtered = filtered.filter(event => event.is_public === 1);
            }
            else if (this.filterOption === 'private') {
                filtered = filtered.filter(event => event.is_public === 0);
            }

            if (this.sortOption === 'newest') {
                return filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (this.sortOption === 'oldest') {
                return filtered.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
            }
        },
        filteredEvents() {
            return this.sortedEvents.filter(event => {
                return event.event_type.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        }
    },
    methods: {
        fetchEvents() {
            const eventsXhr = new XMLHttpRequest();
            eventsXhr.open('GET', '/managers/getManagerEvents', true);
            eventsXhr.onreadystatechange = () => {
                if (eventsXhr.readyState === 4 && eventsXhr.status === 200) {
                    this.events = JSON.parse(eventsXhr.responseText);
                }
            };
            eventsXhr.send();
        },
        fetchUpdates() {
            const updatesXhr = new XMLHttpRequest();
            updatesXhr.open('GET', '/managers/getManagerUpdates', true);
            updatesXhr.onreadystatechange = () => {
                if (updatesXhr.readyState === 4 && updatesXhr.status === 200) {
                    this.updates = JSON.parse(updatesXhr.responseText);
                }
            };
            updatesXhr.send();
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric'};
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        openAddEventModal() {
            this.$refs.addEventModal.openModal();
        },
        deleteEvent(eventId) {
            this.$refs.managerEventCard.deleteEvent(eventId);
        }
    },
    created() {
        this.fetchEvents();
        this.fetchUpdates();
    }
});

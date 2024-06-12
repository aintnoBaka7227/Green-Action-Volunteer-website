// eslint-disable-next-line no-undef
Vue.component('event-members-table', {
    template: `
        <vue-good-table
            :columns="columns"
            :rows="members"
            ref="mytable"
            :search-options="{
                enabled: true
            }"
            @on-selected-rows-change="updateSelectedRows"
        ></vue-good-table>
    `,
    data() {
        return {
            columns: [
                { label: 'First Name', field: 'first_name' },
                { label: 'Last Name', field: 'last_name' },
                { label: 'Email', field: 'email' },
                { label: 'Phone Number', field: 'phone_number' },
            ],
            members: [],
        };
    },
    mounted() {
        this.fetchEventAttendees();
    },
    methods: {
        fetchEventAttendees() {
            const urlParts = window.location.pathname.split('/');
            const eventId = parseInt(urlParts[urlParts.length - 1], 10);

            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/managers/getEventAttendees?eventId=${eventId}`, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    this.members = JSON.parse(xhr.responseText);
                } else if (xhr.readyState === 4) {
                    console.error('Error fetching event attendees:', xhr.responseText);
                }
            };
            xhr.send();
        },
        updateSelectedRows(selectedRows) {
            console.log('Selected rows:', selectedRows);
        },
    },
});

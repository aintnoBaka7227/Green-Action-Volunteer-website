// eslint-disable-next-line no-undef
Vue.component('admins-grid', {
    template: `
        <div>
    <vue-good-table
        :columns="columns"
        :rows="users"
        ref="mytable"
        :search-options="{
        enabled: true
        }"
        :select-options="{
        enabled: true,
        selectOnCheckboxOnly: true,
        selectionInfoClass: 'table-selection-info',
        selectionText: 'selected'
        }"
        @on-selected-rows-change="updateSelectedRows"
    ></vue-good-table>
    </div>
    `,
    data() {
        return {
            users: [],
            selectedRows: [],
            columns: [
                { label: 'First Name', field: 'first_name' },
                { label: 'Last Name', field: 'last_name' },
                { label: 'Phone number', field: 'phone_number'},
                { label: 'Email', field: 'email' },
                { label: 'Gender', field: 'gender' },
                { label: 'User Branch', field: 'state'},
                { label: 'User Type', field: 'user_type'},
                { label: 'User ID', field: 'user_id'}
            ],
        };
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        fetchUsers() {
            const membersXhr = new XMLHttpRequest();
            membersXhr.open('GET', `/admins/getUsers`, true);
            membersXhr.onreadystatechange = () => {
                if (membersXhr.readyState === 4 && membersXhr.status === 200) {
                    this.users = JSON.parse(membersXhr.responseText).map(user => {
                        return {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            phone_number: user.phone_number,
                            email: user.email,
                            gender: user.gender,
                            state: user.state,
                            user_type: user.user_type,
                            user_id: user.user_id
                        };
                    });
                }
            };
            membersXhr.send();
        },

        updateSelectedRows(selectedRows) {
            this.selectedRows = selectedRows;
        },

    },
    mounted() {

    }
});
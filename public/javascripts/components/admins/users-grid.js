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

            <modal v-if="showModal" @close="showModal = false">
                <template v-slot:header>
                    <h3>Add New User</h3>
                </template>
                <template v-slot:body>
                    <label for="first_name">First Name:</label>
                    <input type="text" id="first_name" v-model="newUser.first_name" required>

                    <label for="last_name">Last Name:</label>
                    <input type="text" id="last_name" v-model="newUser.last_name" required>

                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="newUser.email" required>

                    <label for="phone_number">Phone Number:</label>
                    <input type="text" id="phone_number" v-model="newUser.phone_number" required>

                    <label for="gender">Gender:</label>
                    <input type="text" id="gender" v-model="newUser.gender" required>

                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="newUser.password" required>

                    <label for="DOB">Date of Birth:</label>
                    <input type="date" id="DOB" v-model="newUser.DOB" required>
                </template>
                <template v-slot:footer>
                    <button @click="addNewUser">Add</button>
                    <button @click="showModal = false">Cancel</button>
                </template>
            </modal>


        </div>
    `,
    data() {
        return {
            users: [],
            selectedRows: [],
            showModal: false,
            newType: '',
            showChangeUserTypeModal: false,
            newUser: {
                first_name: '',
                last_name: '',
                email: '',
                phone_number: '',
                gender: '',
                password: '',
                DOB: '',
                volunteer_id: '',
                manager_id: '',
                admin_id: '',
            },
            columns: [
                { label: 'First Name', field: 'first_name' },
                { label: 'Last Name', field: 'last_name' },
                { label: 'Phone number', field: 'phone_number'},
                { label: 'Email', field: 'email' },
                { label: 'Gender', field: 'gender' },
                { label: 'User Branch', field: 'state'},
                { label: 'User Type', field: 'user_type'},
                { label: 'User ID', field: 'user_id'},
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
                            user_id: user.user_id,
                            volunteer_id: user.volunteer_id,
                            manager_id: user.manager_id,
                            admin_id: user.admin_id,
                        };
                    });
                }
            };
            membersXhr.send();
        },

        updateSelectedRows(selectedRows) {
            this.selectedRows = selectedRows;
        },

        addNewUser() {
            const user = this.newUser;

            if (!user.first_name || !user.last_name || !user.email || !user.phone_number || !user.gender || !user.password || !user.DOB) {
                alert("Please fill in all fields");
                return;
            }

            const addXhr = new XMLHttpRequest();
            addXhr.open('POST', '/admins/addNewUser', true);
            addXhr.setRequestHeader('Content-Type', 'application/json');
            addXhr.onreadystatechange = () => {
                if (addXhr.readyState === 4) {
                    if (addXhr.status === 200) {
                        const response = JSON.parse(addXhr.responseText);
                        if (response.success) {
                            this.fetchUsers();
                            this.showModal = false;
                            alert('User added successfully!');
                        } else {
                            alert('Error adding user: ' + response.message);
                        }
                    } else {
                        const response = JSON.parse(addXhr.responseText);
                        alert('Error: ' + response.message);
                    }
                }
            };
            addXhr.send(JSON.stringify(user));
        },

        removeUsers() {
           const tableRef = this.$refs.mytable;

           if (!tableRef.selectedRows || tableRef.selectedRows.length === 0) {
                alert("No users selected");
                return;
           }

           const idsToRemove = tableRef.selectedRows.map(row => row.user_id);

           const removeXhr = new XMLHttpRequest();
           removeXhr.open('POST', '/admins/removeUsers', true);
           removeXhr.setRequestHeader('Content-Type', 'application/json');
           removeXhr.onreadystatechange = () => {
            if (removeXhr.readyState === 4 && removeXhr.status === 200) {
                const response = JSON.parse(removeXhr.responseText);
                alert(response.message);
                this.fetchUsers();
                this.selectedRows = [];
            }
           };
           removeXhr.send(JSON.stringify({ ids: idsToRemove }));
        },

        checkSelectedRows() {
            const tableRef = this.$refs.mytable;

            if (!tableRef || !tableRef.selectedRows || tableRef.selectedRows.length === 0) {
                alert("No users selected");
                return;
            }

            if (tableRef.selectedRows.length > 1) {
                alert("Please select only one user to change the type");
                return;
            }
        },

        changeUserDetails() {

        }
    },
    mounted() {
        document.getElementById('add-new-user').addEventListener('click', () => { this.showModal = true; });
        document.getElementById('remove-user').addEventListener('click', this.removeUsers);
        document.getElementById('change-user-type').addEventListener('click', this.checkSelectedRows);
    }
});
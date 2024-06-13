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

            <modal v-if="showChangeUserDetailsModal" @close="showChangeUserDetailsModal = false">
                <template v-slot:header>
                    <h3>Change User Details</h3>
                </template>
                <template v-slot:body>
                    <label for="new_user_type">New User Type:</label>
                    <select id="new_user_type" v-model="newUserType" required>
                        <option value="" disabled>Select new user type</option>
                        <option value="Role unassigned">Role unassigned</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <label for="new_branch">New Branch:</label>
                    <select id="new_branch" v-model="newBranch" required>
                        <option value="" disabled>Select new branch</option>
                        <option value="Branch unassigned">Branch unassigned</option>
                        <option v-for="branch in branches" :key="branch.branch_id" :value="branch.branch_id">{{ branch.state }}</option>
                    </select>
                </template>
                <template v-slot:footer>
                    <button @click="updateUserDetails">Change</button>
                    <button @click="showChangeUserDetailsModal = false" class="cancel-button">Cancel</button>
                </template>
            </modal>

        </div>
    `,
    data() {
        return {
            branches: [],
            users: [],
            selectedRows: [],
            showModal: false,
            showChangeUserDetailsModal: false,
            newUserType: '',
            newBranch: '',
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
                { label: 'Volunteer ID', field: 'volunteer_id'},
                { label: 'Manager ID', field: 'manager_id'},
                { label: 'Admin ID', field: 'admin_id'},
                { label: 'Branch ID', field: 'branch_id'},
            ],
        };
    },
    created() {
        this.fetchUsers();
        this.fetchBranches();
    },
    methods: {
        fetchBranches() {
            const xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/getBranches', true);
            xhttp.onreadystatechange = () => {
              if (xhttp.readyState === 4 && xhttp.status === 200) {
                try {
                  const data = JSON.parse(xhttp.responseText);
                  this.branches = data;
                } catch (error) {
                  console.error('Error parsing response:', error);
                }
              } else if (xhttp.readyState === 4) {
                console.error('Error fetching branches:', xhttp.statusText);
              }
            };
            xhttp.send();
        },

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
                            branch_id: user.branch_id,
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

            this.showChangeUserDetailsModal = true;
        },

        updateUserDetails() {
            const tableRef = this.$refs.mytable;
            const userInfo = tableRef.selectedRows[0];
            const userCurrentType = userInfo.user_type;
            const userNewType = this.newUserType;

            // current branch id, user id, new branch id
            const userCurrentBranchID = userInfo.branch_id;
            const userNewBranchID = this.newBranch;
            const userID = userInfo.user_id;

            if (userCurrentType === userNewType && userCurrentBranchID === userNewBranchID) {
                alert("no changes was made");
                return;
            }

            if ((userNewType === 'Role unassigned' || userNewType === 'Admin') && userNewBranchID != 'Branch unassigned') {
                alert('unassigned role users or admins can\'t be in a branch');
                return;
            }

            if ((userNewType === 'Volunteer' || userNewType === 'Manager') && userNewBranchID === 'Branch unassigned') {
                alert('You need to choose a branch');
                return;
            }



            const updateXhr = new XMLHttpRequest();
            updateXhr.open('POST', '/admins/updateUser', true);
            updateXhr.setRequestHeader('Content-Type', 'application/json');
            updateXhr.onreadystatechange = () => {
                if (updateXhr.readyState === 4 && updateXhr.status === 200) {
                    const response = JSON.parse(updateXhr.responseText);
                    alert(response.message);
                    this.fetchUsers();
                    this.selectedRows = [];
                }
            };

            updateXhr.send(JSON.stringify({userCurrentBranchID: userCurrentBranchID, userNewBranchID: userNewBranchID, userID: userID}));
        }
    },
    mounted() {
        document.getElementById('add-new-user').addEventListener('click', () => { this.showModal = true; });
        document.getElementById('remove-user').addEventListener('click', this.removeUsers);
        document.getElementById('change-user-details').addEventListener('click', this.checkSelectedRows);
    }
});
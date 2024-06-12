// eslint-disable-next-line no-undef
Vue.component('members-grid', {
    template: `
        <div>
    <vue-good-table
        :columns="columns"
        :rows="members"
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
        <h3 slot="header">Add New Volunteer</h3>
        <div slot="body">
        <label for="userId">User ID:</label>
        <input type="text" id="userId" v-model="newUserId">
        </div>
        <div slot="footer">
        <button @click="addNewMember">Add</button>
        <button @click="showModal = false">Cancel</button>
        </div>
    </modal>
    </div>
    `,
    data() {
        return {
            members: [],
            selectedRows: [],
            selectedBranch: '',
            branchID: '',
            showModal: false,
            newUserId: '',
            columns: [
                { label: 'First Name', field: 'first_name' },
                { label: 'Last Name', field: 'last_name' },
                { label: 'Email', field: 'email' },
                { label: 'Notification Status', field: 'is_subscribed_notis',
                    type: 'boolean',
                    formatter: (value) => value ? 'Subscribed' : 'Not Subscribed' },
                { label: 'DOB', field: 'formatted_dob' },
                { label: 'Gender', field: 'gender' },
                { label: 'Volunteer ID', field: 'volunteer_id'}
            ],
        };
    },
    created() {
        this.fetchManagerBranch();
    },
    methods: {
        fetchManagerBranch() {
            const branchXhr = new XMLHttpRequest();
            branchXhr.open('GET', '/managers/getManagerBranch', true);
            branchXhr.onreadystatechange = () => {
                if (branchXhr.readyState === 4 && branchXhr.status === 200) {
                    const response = JSON.parse(branchXhr.responseText);
                    this.selectedBranch = response.state;
                    this.branchID = response.branch_id;
                    this.fetchMembers(this.selectedBranch);
                }
            };
            branchXhr.send();
        },

        fetchMembers(branch) {
            const membersXhr = new XMLHttpRequest();
            membersXhr.open('GET', `/managers/getBranchMembers?branch=${branch}`, true);
            membersXhr.onreadystatechange = () => {
                if (membersXhr.readyState === 4 && membersXhr.status === 200) {
                    this.members = JSON.parse(membersXhr.responseText).map(member => {
                        return {
                            first_name: member.first_name,
                            last_name: member.last_name,
                            email: member.email,
                            is_subscribed_notis: member.is_subscribed_notis ? 'Subscribed' : 'Not Subscribed',
                            formatted_dob: new Date(member.DOB).toLocaleDateString(),
                            gender: member.gender,
                            volunteer_id: member.volunteer_id
                        };
                    });
                }
            };
            membersXhr.send();
        },

        updateSelectedRows(selectedRows) {
            this.selectedRows = selectedRows;
        },

        removeMembers() {
            const tableRef = this.$refs.mytable;

            // Check if there are any selected rows
            if (!tableRef.selectedRows || tableRef.selectedRows.length === 0) {
                alert("No volunteers selected");
                return;
            }

            const idsToRemove = tableRef.selectedRows.map(row => row.volunteer_id);

            const removeXhr = new XMLHttpRequest();
            removeXhr.open('POST', '/managers/removeBranchMembers', true);
            removeXhr.setRequestHeader('Content-Type', 'application/json');
            removeXhr.onreadystatechange = () => {
                if (removeXhr.readyState === 4 && removeXhr.status === 200) {
                    this.fetchMembers(this.selectedBranch);
                    this.selectedRows = [];
                }
            };
            removeXhr.send(JSON.stringify({ ids: idsToRemove }));
        },

        addNewMember() {
            const userId = this.newUserId;
            const branchId = this.branchID;

            if (!userId) {
            alert("Please enter a User ID");
            return;
            }

            const addXhr = new XMLHttpRequest();
            addXhr.open('POST', '/managers/addVolunteer', true);
            addXhr.setRequestHeader('Content-Type', 'application/json');
            addXhr.onreadystatechange = () => {
            if (addXhr.readyState === 4) {
                if (addXhr.status === 200) {
                    const response = JSON.parse(addXhr.responseText);
                    if (response.message) {
                        this.fetchMembers(this.selectedBranch);
                        this.newUserId = '';
                        this.showModal = false;
                        alert(response.message);
                    }

                    if (response.error) {
                        alert(response.error);
                    }
                }
                else {
                    const response = JSON.parse(addXhr.responseText);
                    alert(response.error);
                }
            }


            };
            addXhr.send(JSON.stringify({ user_id: userId, branch_id: branchId }));
        }

    },
    mounted() {
        document.getElementById('remove-volunteers').addEventListener('click', this.removeMembers);
        document.getElementById('add-new-volunteers').addEventListener('click', () => { this.showModal = true; });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // eslint-disable-next-line no-undef
    Vue.component('members-grid', {
        template: `
            <vue-good-table
                :columns="columns"
                :rows="members"
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
                >
            </vue-good-table>
        `,
        data() {
            return {
                members: [],
                selectedBranch: '',
                columns: [
                    { label: 'First Name', field: 'first_name' },
                    { label: 'Last Name', field: 'last_name' },
                    { label: 'Email', field: 'email' },
                    { label: 'Notification Status', field: 'is_subscribed_notis',
                      type: 'boolean',
                      formatter: (value) => value ? 'Subscribed' : 'Not Subscribed' },
                    { label: 'DOB', field: 'formatted_dob' },
                    { label: 'Gender', field: 'gender' }
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
                                gender: member.gender
                            };
                        });
                    }
                };
                membersXhr.send();
            },

            updateSelectedRows(selectedRows) {
                this.selectedRows = selectedRows;
            },

            removeSelectedVolunteers() {
                if (this.selectedRows.length === 0) {
                    alert("No volunteers selected");
                    return;
                }

                const idsToRemove = this.selectedRows.map(row => row.volunteers_id);

                const removeXhr = new XMLHttpRequest();
                removeXhr.open('POST', '/volunteers/remove', true);
                removeXhr.setRequestHeader('Content-Type', 'application/json');
                removeXhr.onreadystatechange = () => {
                    if (removeXhr.readyState === 4 && removeXhr.status === 200) {
                        // Remove the volunteers from the members list
                        this.members = this.members.filter(member => !idsToRemove.includes(member.volunteers_id));
                        this.selectedRows = []; // Clear the selection
                    }
                };
                removeXhr.send(JSON.stringify({ ids: idsToRemove }));
            }

        },
        mounted () {
            document.getElementById('remove-volunteers').addEventListener('click', this.removeMembers);
        }
    });
});
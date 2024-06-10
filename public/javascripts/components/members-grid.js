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
                >
            </vue-good-table>
        `,
        data() {
            return {
                members: [],
                selectedBranch: 'SA',
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
            this.fetchMembers(this.selectedBranch);
        },
        methods: {
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
            }
        }
    });
});
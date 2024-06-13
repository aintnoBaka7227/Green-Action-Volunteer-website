// eslint-disable-next-line no-undef
Vue.component('my-branches-card', {
    template:
        `<a :href="'/admins/branches/' + branchId" class="my-branches-card">
        <h2>{{ branchName }}</h2>
        <div>Head Manager: {{ displayedBranchManager }}</div>
        <div>Number of volunteers: {{ volunteerCount }}</div>
    </a>`,
    props: {
        branchName: {
            type: String,
            required: true
        },
        branchManager: {
            type: String,
            required: true
        },
        volunteerCount: {
            type: Number,
            required: true
        },
        branchId: {
            type: Number,
            required: true
        },
    },
    computed: {
        buttonText() {
            return this.isUserIn ? 'Leave' : 'Join';
        },
        classButtonText() {
            return this.isUserIn ? 'red-button' : 'green-button';
        },
        displayedBranchManager() {
            return this.branchManager ? this.branchManager : 'No Manager';
        }
    },
});
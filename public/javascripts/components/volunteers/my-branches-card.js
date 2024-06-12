// eslint-disable-next-line no-undef
Vue.component('my-branches-card', {
    template:
    `<div class="my-branches-card">
        <h2>{{ branchName }}</h2>
        <div>Head Manager: {{ branchManager }}</div>
        <div>Number of volunteers: {{ branchNumVolunteers }}</div>
        <button @click="modifyBranch" class="branch-card-button" type="button">{{ modifyBranchButtonText }}</button>
    </div>`,
    props: {
        branchName: {
            type: String,
            required: true
        },
        branchManager: {
            type: String,
            required: true
        },
        branchNumVolunteers: {
            type: Number,
            required: true
        },
        branchId: {
            type: Number,
            required: true
        },
        modifyBranchButtonText: {
            type: String,
            required: true
        },
        volunteerId: {
            type: Number,
            required: true
        }
    },
    methods: {
        modifyBranch() {
        }
    }
});
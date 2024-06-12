// eslint-disable-next-line no-undef
Vue.component('my-branches-card', {
    template:
        `<div class="my-branches-card">
        <h2>{{ branchName }}</h2>
        <div>Head Manager: {{ branchManager }}</div>
        <div>Number of volunteers: {{ volunteerCount }}</div>
        <button @click="modifyBranch(branchId, userId)" :class="'branch-card-button ' + classButtonText" type="button">{{ buttonText }}</button>
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
        volunteerCount: {
            type: Number,
            required: true
        },
        branchId: {
            type: Number,
            required: true
        },
        isUserIn: {
            type: Boolean,
            required: true
        },
        userId: {
            type: Number,
            required: true
        }
    },
    computed: {
        buttonText() {
            return this.isUserIn ? 'Leave' : 'Join';
        },
        classButtonText() {
            return this.isUserIn ? 'red-button' : 'green-button';
        }
    },
    methods: {
        modifyBranch(branchId, userId) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/volunteers/modifyBranch', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('Success:', JSON.parse(xhr.responseText));
                        // Update the UI based on the response
                        // Refresh the page after the request is successful
                        location.reload();
                    } else {
                        console.error('Error:', xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify({ branchId: branchId, userId: userId }));
        }
    }
});
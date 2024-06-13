Vue.component('branch-details', {
    template: `
        <div>
            <h1>Your Branch Details</h1>
            <div v-if="branch">
                <form @submit.prevent="updateBranch">
                    <div>
                        <label for="phone_number">Phone Number:</label>
                        <input id="phone_number" v-model="branch.phone_number" type="text" required>
                    </div>
                    <div>
                        <label for="street_address">Street Address:</label>
                        <input id="street_address" v-model="branch.street_address" type="text" required>
                    </div>
                    <div>
                        <label for="city">City:</label>
                        <input id="city" v-model="branch.city" type="text" required>
                    </div>
                    <div>
                        <label for="postcode">Postcode:</label>
                        <input id="postcode" v-model="branch.postcode" type="text" required>
                    </div>
                    <button type="submit">Update Branch</button>
                </form>
            </div>
            <div v-else>
                Loading branch details...
            </div>
            <div v-if="notification" class="notification">{{ notification }}</div>
        </div>
    `,
    data() {
        return {
            branch: null,
            notification: ''
        };
    },
    mounted() {
        this.fetchBranchDetails();
    },
    methods: {
        fetchBranchDetails() {
            const xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/managers/getBranchDetail', true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === XMLHttpRequest.DONE) {
                    if (xhttp.status === 200) {
                        this.branch = JSON.parse(xhttp.responseText);
                    } else {
                        console.error('Failed to fetch branch details');
                    }
                }
            };
            xhttp.onerror = () => {
                console.error('An error occurred during the request');
            };
            xhttp.send();
        },
        updateBranch() {
            const branchId = this.branch.branch_id;

            const xhttp = new XMLHttpRequest();
            xhttp.open('PUT', `/managers/updateBranchDetail/${branchId}`, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === XMLHttpRequest.DONE) {
                    if (xhttp.status === 200) {
                        console.log('Branch details updated successfully');
                        this.notification = 'Updated successfully!';
                        setTimeout(() => {
                          this.notification = '';
                        }, 3000);
                    } else {
                        console.error('Failed to update branch details');
                    }
                }
            };
            xhttp.onerror = () => {
                console.error('An error occurred during the request');
            };

            const updatedBranch = {
                phone_number: this.branch.phone_number,
                street_address: this.branch.street_address,
                city: this.branch.city,
                postcode: this.branch.postcode
            };

            xhttp.send(JSON.stringify(updatedBranch));
        }
    }
});

// eslint-disable-next-line no-undef
Vue.component('add-branch-modal', {
    template: `
      <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <h2>Add New Branch</h2>
          <form @submit.prevent="submitForm">
            <label for="branch-name">Branch Name</label>
            <input placeholder="Enter branch name here..." type="text" id="branch-name" v-model="formData.branchName" required>

            <label for="branch-street">Branch Street Address</label>
            <input placeholder="Enter street address here..." type="text" id="branch-street" v-model="formData.branchStreet" required>

            <label for="branch-city">Branch City</label>
            <input placeholder="Enter city here..." type="text" id="branch-city" v-model="formData.branchCity" required>

            <label for="branch-state">Branch State</label>
            <input placeholder="Enter state here..." type="text" id="branch-state" v-model="formData.branchState" required>

            <label for="branch-postcode">Branch Postcode</label>
            <input placeholder="Enter postcode here..." type="text" id="branch-postcode" v-model="formData.branchPostcode" required>

            <label for="branch-phone">Branch Phone Number</label>
            <input placeholder="Enter phone number here..." type="tel" id="branch-phone" v-model="formData.branchPhone" required>

            <button type="submit">Create Branch</button>
          </form>
        </div>
      </div>
    `,
    props: ['onBranchAdded'],
    data() {
        return {
            showModal: false,
            formData: {
                branchName: '',
                branchStreet: '',
                branchCity: '',
                branchState: '',
                branchPostcode: '',
                branchPhone: ''
            }
        };
    },
    methods: {
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            // Reset form data when modal is closed
            this.formData.branchName = '';
            this.formData.branchStreet = '';
            this.formData.branchCity = '';
            this.formData.branchState = '';
            this.formData.branchPostcode = '';
            this.formData.branchPhone = '';
        },
        submitForm() {
            // Here you would typically send a POST request to your backend to create the branch
            console.log('Form submitted with data:', this.formData);

            // Create a new XMLHttpRequest object
            const xhr = new XMLHttpRequest();

            // Configure it: POST-request for the URL /admins/createNewBranch
            xhr.open('POST', '/admins/createNewBranch', true);

            // Set the request header to indicate the format of the request body
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            // Define a callback function to handle any response
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) { // 4 means the request is done
                    if (xhr.status === 200) { // 200 means a successful request
                        console.log('Response received:', xhr.responseText);
                        // Close the modal after form submission
                        this.closeModal();
                        if (this.onBranchAdded) {
                            this.onBranchAdded();
                        }

                    } else {
                        console.error('Error during the request:', xhr.status, xhr.statusText);
                        // Optionally handle the error here
                    }
                }
            };

            // Convert formData to a JSON string
            const jsonData = JSON.stringify(this.formData);
            console.log(jsonData);
            // Send the request with the JSON payload
            xhr.send(jsonData);
        },
        handleOverlayClick() {
            this.closeModal();
        }
    }
});
var addUpdateModal = Vue.component('add-update-modal', {
    template: `
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h2>Post New Update</h2>
                <hr>
                <form @submit.prevent="submitNewUpdate">
                    <div>
                    <label for="update-title">Update Title:</label>
                    <input id="update-title" v-model="updateTitle" type="text" required>
                    </div>
                    <div>
                    <label for="update-content">Content:</label>
                    <textarea id="update-content" v-model="updateContent" rows="8" type="text" required></textarea>
                    </div>
                    <div>
                        <label>Visibility:</label>
                        <input type="radio" id="public" value="1" v-model="visibility" name="visibility" required>
                        <label for="public">Public</label>
                        <input type="radio" id="private" value="0" v-model="visibility" name="visibility" required>
                        <label for="private">Private</label>
                    </div>
                    <button type="submit">Post Update</button>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            showModal: false,
            updateTitle: '',
            branchId: '',
            updateContent: '',
            visibility: '1'
        };
    },
    methods: {
        openModal() {
            this.showModal = true;
            this.fetchManagerBranch();
        },
        closeModal() {
            this.showModal = false;
            this.updateTitle = '';
            this.branchId = '';
            this.updateContent = '';
            this.visibility = '1';
        },
        submitNewUpdate() {
            const updateData = {
                update_title: this.updateTitle,
                branch_id: this.branchId,
                content: this.updateContent,
                is_public: this.visibility,
            };

            const xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/managers/postUpdate', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.onreadystatechange = () => {
              if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                  this.closeModal();
                  this.$emit('update-posted');
                } else {
                  console.error('Failed to post update');
                }
              }
            };

            xhttp.onerror = () => {
              console.error('An error occurred during the request');
            };

            xhttp.send(JSON.stringify(updateData));
        },
        fetchManagerBranch() {
            const xhttp = new XMLHttpRequest();
            xhttp.open('GET', `/managers/getManagerBranch`, true);
            xhttp.onreadystatechange = () => {
              if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                  const response = JSON.parse(xhttp.responseText);
                  this.branchId = response.branch_id;
                } else {
                  console.error('Failed to fetch user branch');
                }
              }
            };
            xhttp.onerror = () => {
              console.error('An error occurred during the request');
            };
            xhttp.send();
        }
    }
})
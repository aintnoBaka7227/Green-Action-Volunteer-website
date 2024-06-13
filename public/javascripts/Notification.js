// eslint-disable-next-line no-undef
var myBranchNotis = Vue.component('my-branches-card', {
    props: ['branch'],
    template: `
      <div class="my-branches-card">
          <h2>{{ branch.branch_name }}</h2>
          <label>
              <input type="checkbox" v-model="branch.subscribed_event" @change="updateSubscription"> Subscribed Event
          </label>
          <label>
              <input type="checkbox" v-model="branch.subscribed_update" @change="updateSubscription"> Subscribed Update
          </label>
      </div>
  `,
    methods: {
        updateSubscription() {
            const xhr = new XMLHttpRequest();
            const url = '/volunteers/update-subscription';
            xhr.open('POST', url, true);

            // Set headers
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', localStorage.getItem('token')); // Assuming token is stored in localStorage

            // Prepare request body
            const requestBody = JSON.stringify({
                branchId: this.branch.branch_id,
                subscribedEvent: this.branch.subscribed_event ? 1 : 0,
                subscribedUpdate: this.branch.subscribed_update ? 1 : 0
            });

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            console.log('Subscription updated successfully:', data);
                        } catch (error) {
                            console.error('Error parsing JSON response', error);
                        }
                    } else {
                        console.error('Error updating subscription. Status:', xhr.status);
                    }
                }
            };

            xhr.send(requestBody);
        }
    }
});

window.onload = function () {
    // eslint-disable-next-line no-undef
    new Vue({
        el: '#app',
        data: {
            branches: [],
        },
        mounted() {
            this.fetchBranches();
        },
        methods: {
            fetchBranches() {
                const xhr = new XMLHttpRequest();
                const url = '/volunteers/notification-branches';
                xhr.open('GET', url, true);

                // Set headers
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); // Assuming token is stored in localStorage

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                this.branches = data.branches;
                            } catch (error) {
                                console.error('Error parsing JSON response', error);
                            }
                        } else {
                            console.error('Error fetching branches. Status:', xhr.status);
                        }
                    }
                };

                xhr.send();
            }
        }
    });
};

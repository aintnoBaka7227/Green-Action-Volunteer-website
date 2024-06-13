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
          fetch('/volunteers/update-subscription', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': localStorage.getItem('token') // Assuming token is stored in localStorage
              },
              body: JSON.stringify({
                  branchId: this.branch.branch_id,
                  subscribedEvent: this.branch.subscribed_event ? 1 : 0,
                  subscribedUpdate: this.branch.subscribed_update ? 1 : 0
              })
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              console.log('Subscription updated successfully:', data);
          })
          .catch(error => {
              console.error('Error updating subscription:', error);
          });
      }
  }
});

window.onload = function () {
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
              fetch('/volunteers/notification-branches', {
                  headers: {
                      'Authorization': localStorage.getItem('token') // Assuming token is stored in localStorage
                  }
              })
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.json();
              })
              .then(data => {
                  this.branches = data.branches;
              })
              .catch(error => {
                  console.error('Error fetching branches:', error);
              });
          }
      }
  });
}

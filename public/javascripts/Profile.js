const userProfileApp = new Vue({
  el: '#app',
  data: {
      user: {
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          gender: '',
          dob: '',
          password: ''
      }
  },
  created() {
      this.loadUserData();
  },
  methods: {
    async loadUserData() {
        try {
            const response = await fetch('/users/me');
            if (response.ok) {
                const userData = await response.json();
                this.user.first_name = userData.first_name;
                this.user.last_name = userData.last_name;
                this.user.email = userData.email;
                this.user.phone_number = userData.phone_number;
                this.user.gender = userData.gender;
                this.user.dob = userData.DOB ? userData.DOB.split('T')[0] : '';
            } else {
                console.error('Error loading user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },
    async handleFormSubmit() {
        try {
            const response = await fetch('/users/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.user)
            });

            if (response.ok) {
                alert('User updated successfully');
            } else {
                alert('Error updating user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    },
    goBack() {
        window.history.back(); // This will navigate back to the previous page
    }
  }
});

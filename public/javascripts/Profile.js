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
    loadUserData() {
        return new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/users/me');
            xhttp.onload = () => {
                if (xhttp.status >= 200 && xhttp.status < 300) {
                    const userData = JSON.parse(xhttp.responseText);
                    this.user.first_name = userData.first_name;
                    this.user.last_name = userData.last_name;
                    this.user.email = userData.email;
                    this.user.phone_number = userData.phone_number;
                    this.user.gender = userData.gender;
                    this.user.dob = userData.DOB ? userData.DOB.split('T')[0] : '';
                    resolve(xhttp.response);
                } else {
                    console.error('Error loading user data:', xhttp.statusText);
                    reject(xhttp.statusText);
                }
            };
            xhttp.onerror = () => {
                console.error('Error loading user data:', xhttp.statusText);
                reject(xhttp.statusText);
            };
            xhttp.send();
        });
    },
    handleFormSubmit() {
        return new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/users/edit');
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.onload = () => {
                if (xhttp.status >= 200 && xhttp.status < 300) {
                    alert('User updated successfully');
                    resolve(xhttp.response);
                } else {
                    alert('Error updating user');
                    reject(xhttp.statusText);
                }
            };
            xhttp.onerror = () => {
                console.error('Error updating user:', xhttp.statusText);
                reject(xhttp.statusText);
            };
            xhttp.send(JSON.stringify(this.user));
        });
    },
    goBack() {
        window.history.back(); // This will navigate back to the previous page
    }
  }
});

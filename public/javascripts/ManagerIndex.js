// eslint-disable-next-line no-undef
new Vue({
    el: '#app',
    data: {
        user_name: "",
    },
    methods: {
        fetchUserName() {
            // Save the 'this' context to a variable
            const self = this;

            // Create a new XMLHttpRequest object
            const xhr = new XMLHttpRequest();

            // Configure it: GET-request for the URL /admins/getUserName
            xhr.open('GET', '/users/user-name');

            // Setup a callback function to handle the response
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // Success: Parse the JSON response
                    const response = JSON.parse(xhr.responseText);
                    // Assuming the response contains a 'name' field
                    self.user_name = response.first_name; // Update user_name using 'self'
                } else {
                    // Error: Handle the error case
                    console.error('Request failed. Status:', xhr.status);
                }
            };

            // Handle network errors
            xhr.onerror = function () {
                console.error('Network request failed');
            };

            // Send the request
            xhr.send();
        }
    },
    created() {
        this.fetchUserName(); // Call fetchUserName() on component creation
    }
});

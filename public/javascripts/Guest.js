window.onload = function () {
    // eslint-disable-next-line no-undef
    new Vue({
        el: '#app',
        data: {
            events: [],
            updates: [],
            selectedBranch: 'SA',
            isDropdownVisible: false,
            branches: []
        },
        created() {
            this.fetchBranches();
            document.addEventListener("click", this.closeDropdowns);
            this.fetchUpdatesAndEvents(this.selectedBranch);
        },
        methods: {
            toggleDropdown() {
                this.isDropdownVisible = !this.isDropdownVisible;
            },
            closeDropdowns(event) {
                if (!event.target.closest(".dropdown")) {
                    this.isDropdownVisible = false;
                }
            },
            selectBranch(branch) {
                this.selectedBranch = branch.state;
                this.fetchUpdatesAndEvents(branch.state);
                this.toggleDropdown();
            },
            fetchBranches() {
                const xhttp = new XMLHttpRequest();
                xhttp.open('GET', '/getBranches', true);
                xhttp.onreadystatechange = () => {
                  if (xhttp.readyState === 4 && xhttp.status === 200) {
                    try {
                      const data = JSON.parse(xhttp.responseText);
                      this.branches = data;
                    } catch (error) {
                      console.error('Error parsing response:', error);
                    }
                  } else if (xhttp.readyState === 4) {
                    console.error('Error fetching branches:', xhttp.statusText);
                  }
                };
                xhttp.send();
            },
            fetchUpdatesAndEvents(branch) {
                const eventsXhr = new XMLHttpRequest();
                eventsXhr.open('GET', `/getPublicEvents?branch=${branch}`, true);
                eventsXhr.onreadystatechange = () => {
                    if (eventsXhr.readyState === 4 && eventsXhr.status === 200) {
                    this.events = JSON.parse(eventsXhr.responseText);
                    }
                };
                eventsXhr.send();

                const updatesXhr = new XMLHttpRequest();
                updatesXhr.open('GET', `/getPublicUpdates?branch=${branch}`, true);
                updatesXhr.onreadystatechange = () => {
                    if (updatesXhr.readyState === 4 && updatesXhr.status === 200) {
                    this.updates = JSON.parse(updatesXhr.responseText);
                    }
                };
                updatesXhr.send();
            },
        }
    });
};
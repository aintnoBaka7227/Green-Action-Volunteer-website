window.onload = function () {
    new Vue({
        el: '#app',
        data: {
            events: [],
            updates: [],
            selectedBranch: 'SA',
            isDropdownVisible: false,
        },
        created() {
            // this.fetchEvents(this.selectedBranch);
            // this.fetchUpdates();
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
              this.selectedBranch = branch;
              this.fetchUpdatesAndEvents(branch);
              this.toggleDropdown();
            },
            // fetchEvents(branch) {
            //     const xhr = new XMLHttpRequest();
            //     xhr.open('GET', `/getPublicEvents?branch=${branch}`, true);
            //     xhr.onreadystatechange = () => {
            //         if (xhr.readyState === 4 && xhr.status === 200) {
            //             this.events = JSON.parse(xhr.responseText);
            //         }
            //     };
            //     xhr.send();
            // },
            // fetchUpdates() {
            //     const xhr = new XMLHttpRequest();
            //     xhr.open('GET', '/getPublicUpdates', true);
            //     xhr.onreadystatechange = () => {
            //         if (xhr.readyState === 4 && xhr.status === 200) {
            //             this.updates = JSON.parse(xhr.responseText);
            //         }
            //     };
            //     xhr.send();
            // }
            fetchUpdatesAndEvents(branch) {
                const eventsXhr = new XMLHttpRequest();
                eventsXhr.open('GET', `/getPublicEvents?branch=${branch}`, true);
                eventsXhr.onreadystatechange = () => {
                    if (eventsXhr.readyState === 4 && eventsXhr.status === 200) {
                    this.events = JSON.parse(eventsXhr.responseText);
                    console.log("Events data:", this.events);
                    }
                };
                eventsXhr.send();

                const updatesXhr = new XMLHttpRequest();
                updatesXhr.open('GET', `/getPublicUpdates?branch=${branch}`, true);
                updatesXhr.onreadystatechange = () => {
                    if (updatesXhr.readyState === 4 && updatesXhr.status === 200) {
                    this.updates = JSON.parse(updatesXhr.responseText);
                    // console.log("Events data:", updates);
                    }
                };
                updatesXhr.send();
            },
        }
    });
}
window.onload = function () {
    // eslint-disable-next-line no-undef
    new Vue({
        el: '#app',
        data: {
            events: [],
            updates: [],
            selectedBranch: 'SA',
            isDropdownVisible: false,
        },
        created() {
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
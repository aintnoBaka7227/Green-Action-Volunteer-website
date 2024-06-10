// load toogle for profile pics
document.addEventListener("DOMContentLoaded", function() {
    const dropdownToggle = document.querySelector(".dropdown-toggle");

    dropdownToggle.addEventListener("click", function() {
        const dropdown = this.parentNode;
        dropdown.classList.toggle("show");
    });

    document.addEventListener("click", function(event) {
        if (!event.target.closest(".dropdown")) {
        const dropdowns = document.querySelectorAll(".dropdown");
        dropdowns.forEach(function(dropdown) {
            dropdown.classList.remove("show");
        });
        }
    });
});

// retrieve all events of the manager's branch (demo without checking the manager branch)
// no add or remove events functionality
window.onload = function () {
    // eslint-disable-next-line no-undef
    new Vue({
        el: '#app',
        data: {
            events: [],
            updates: [],
            selectedBranch: 'SA',

        },
        created() {
            this.fetchUpdatesAndEvents(this.selectedBranch);
        },
        methods: {
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

// fetch members
window.onload = function () {
    // eslint-disable-next-line no-undef
    new Vue({
        el: "#members",
        data: {
            members: [],
            selectedBranch: 'SA',
        },
        created() {
            this.fetchMembers(this.selectedBranch);
        },
        methods: {
            fetchMembers(branch) {
                const membersXhr = new XMLHttpRequest();
                membersXhr.open('GET', `/managers/getBranchMembers?branch=${branch}`, true);
                membersXhr.onreadystatechange = () => {
                    if (membersXhr.readyState === 4 && membersXhr.status === 200) {
                    this.members = JSON.parse(membersXhr.responseText);
                    }
                };
                membersXhr.send();
            }
        }
    });
};


Vue.component('navbar-guest', {
    template: `
      <header>
        <a href="/guests/index.html" class="logo"><img src="../images/logo.png" alt="Logo" class="logo-image"></a>
        <ul>
          <div class="section">
            <li><a href="/guests/about.html">About Us</a></li>
            <li><a href="/guests/updates.html">Updates</a></li>
            <li><a href="/guests/events.html">Events</a></li>
          </div>
          <div class="section">
            <li><a href="#log-in">Log In</a></li>
            <li class="sign-up"><a href="#sign-up">Sign Up</a></li>
            <div class="dropdown" :class="{ show: isDropdownVisible }">
              <button type="button" class="dropdown-toggle" @click="toggleDropdown">{{ selectedBranch }}<i class="fas fa-chevron-down"></i></button>
              <div class="dropdown-content">
                <a href="#" @click.prevent="selectBranch('SA')">SA</a>
                <a href="#" @click.prevent="selectBranch('VIC')">VIC</a>
                <a href="#" @click.prevent="selectBranch('NSW')">NSW</a>
              </div>
            </div>
          </div>
        </ul>
      </header>
    `,
    data: function () {
        return {
            isDropdownVisible: false,
            selectedBranch: 'SA',
            // events: [],
            // updates: [],
        };
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
          // this.fetchUpdatesAndEvents(branch);
          this.toggleDropdown();
        },
      //   fetchUpdatesAndEvents(branch) {
      //     const eventsXhr = new XMLHttpRequest();
      //     eventsXhr.open('GET', `/getPublicEvents?branch=${branch}`, true);
      //     eventsXhr.onreadystatechange = () => {
      //       if (eventsXhr.readyState === 4 && eventsXhr.status === 200) {
      //         this.eventsData = JSON.parse(eventsXhr.responseText);
      //         console.log("Events data:", eventsData);
      //       }
      //     };
      //     eventsXhr.send();

      //     const updatesXhr = new XMLHttpRequest();
      //     updatesXhr.open('GET', `/getPublicUpdates?branch=${branch}`, true);
      //     updatesXhr.onreadystatechange = () => {
      //       if (updatesXhr.readyState === 4 && updatesXhr.status === 200) {
      //         this.updates = JSON.parse(updatesXhr.responseText);
      //         // console.log("Events data:", updatesData);
      //       }
      //     };
      //     updatesXhr.send();
      // },
    },
    mounted() {
        document.addEventListener("click", this.closeDropdowns);
        // this.fetchUpdatesAndEvents(this.selectedBranch);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.closeDropdowns);
    }
});

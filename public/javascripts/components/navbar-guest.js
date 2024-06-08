// eslint-disable-next-line no-undef
var navbarGuest = Vue.component('navbar-guest', {
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
              <button type="button" class="dropdown-toggle" @click="toggleDropdown">SA<i class="fas fa-chevron-down"></i></button>
              <div class="dropdown-content">
                <a href="#">SA</a>
                <a href="#">TAS</a>
                <a href="#">VIC</a>
              </div>
            </div>
          </div>
        </ul>
      </header>
    `,
    data: function () {
        return {
            isDropdownVisible: false
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
        }
    },
    mounted() {
        document.addEventListener("click", this.closeDropdowns);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.closeDropdowns);
    }
});

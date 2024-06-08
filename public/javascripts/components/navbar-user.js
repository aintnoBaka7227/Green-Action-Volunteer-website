// eslint-disable-next-line no-undef
var navbarUser = Vue.component('navbar-user', {
    props: ['userType'],
    template: `
      <header>
          <a :href="generateLink('index.html') class="logo">
              <img src="/assets/logo.png" alt="Logo" class="logo-image">
          </a>
          <ul>
              <li><a class="nav-title" :href="generateLink('index.html')">Dashboard</a></li>
              <li><a class="nav-title" :href="generateLink('members.html')">Members</a></li>
              <li><a class="nav-title" :href="generateLink('events.html')">Events</a></li>
              <li><a class="nav-title" :href="generateLink('updates.html')">Updates</a></li>
              <div class="dropdown">
                  <button type="button" class="dropdown-toggle" style="background-color: transparent;"><img class="profile-pic" src="/assets/profile-pic.jpg" alt="profile pic"></button>
                  <div class="dropdown-content">
                      <a href="#">Profile</a>
                      <a href="#">Settings</a>
                      <a href="#">Log Out</a>
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
        },
        generateLink(page) {
            return `/${this.userType}/${page}`;
        }
    },
    mounted() {
        document.addEventListener("click", this.closeDropdowns);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.closeDropdowns);
    }
});

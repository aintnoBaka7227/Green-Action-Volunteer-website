// eslint-disable-next-line no-undef
var navbarManager = Vue.component('navbar-manager', {
    props: ['userType'],
    template: `
      <header>
        <a :href="generateLink('index.html')" class="logo">
            <img src="../images/logo.png" alt="Logo" class="logo-image">
        </a>
        <ul>
            <div class="section">
                <li><a class="nav-title" :href="generateLink('homepage.html')">Dashboard</a></li>
                <li><a class="nav-title" :href="generateLink('members.html')">Members</a></li>
                <li><a class="nav-title" :href="generateLink('updates.html')">Updates</a></li>
                <li><a class="nav-title" :href="generateLink('events.html')">Events</a></li>
            </div>
            <div class="section">
                <div class="dropdown" :class="{ show: isDropdownVisible }">
                    <button class="dropdown-toggle" @click="toggleDropdown"><img class="profile-pic" src="../images/profile-pic.jpg" alt="profile pic"></button>
                    <div class="dropdown-content">
                        <a href="#">Profile</a>
                        <a href="#">Settings</a>
                        <a href="#">Log Out</a>
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
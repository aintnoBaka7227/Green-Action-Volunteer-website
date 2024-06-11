// eslint-disable-next-line no-undef
Vue.component('navbar-manager', {
    props: ['userType'],
    template: `
      <header>
        <a :href="generateLink('index.html')" class="logo">
            <img src="../images/logo.png" alt="Logo" class="logo-image">
        </a>
        <ul>
            <div class="section">
                <li><a class="nav-title" id="nav-homepage" :href="generateLink('index.html')">Dashboard</a></li>
                <li><a class="nav-title" id="nav-members" :href="generateLink('members.html')">Members</a></li>
                <li><a class="nav-title" id="nav-updates" :href="generateLink('updates.html')">Updates</a></li>
                <li><a class="nav-title" id="nav-events" :href="generateLink('events.html')">Events</a></li>
            </div>
            <div class="section">
                <div class="dropdown" :class="{ show: isDropdownVisible }">
                    <button class="dropdown-toggle" @click="toggleDropdown"><img class="profile-pic" src="../images/profile-pic.jpg" alt="profile pic"></button>
                    <div class="dropdown-content">
                        <a href="../profile-settings.html">Profile Settings</a>
                        <a href="#" @click.prevent="logout">Log Out</a>
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
        },
        async logout() {
            try {
                const response = await fetch('/users/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    window.location.href = '/';
                } else {
                    console.error('Logout failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during logout:', error);
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

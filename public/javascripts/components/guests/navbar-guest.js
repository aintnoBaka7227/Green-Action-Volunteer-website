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
            <li><a href="../logins.html">Log In</a></li>
            <li class="sign-up"><a href="../signups.html">Sign Up</a></li>
            <div class="dropdown" :class="{ show: isDropdownVisible }">
              <button type="button" class="dropdown-toggle" @click="toggleDropdown">{{ selectedBranch }}<i class="fas fa-chevron-down"></i></button>
              <div class="dropdown-content">
                <a href="#" v-for="branch in branches" :key="branch_id" @click.prevent="selectBranch(branch)">{{ branch.state }}</a>
              </div>
            </div>
          </div>
        </ul>
      </header>
    `,
});

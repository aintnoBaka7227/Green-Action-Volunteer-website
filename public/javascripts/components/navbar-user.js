var navbarUser = Vue.component(
    'navbar-user', {
    template: `<header>
        <a href="index.html" class="logo">
            <img src="../images/logo.png" alt="Logo" class="logo-image">
        </a>
        <ul>
            <div class="section">
                <li><a class="nav-title" href="index.html" style="font-weight: bold;">Dashboard</a></li>
                <li><a class="nav-title" href="members.html">Members</a></li>
                <li><a class="nav-title" href="events.html">Events</a></li>
                <li><a class="nav-title" href="updates.html">Updates</a></li>
            </div>
            <div class="section">
                <div class="dropdown">
                    <button class="dropdown-toggle"><img class="profile-pic" src="../images/profile-pic.jpg" alt="profile pic"></button>
                    <div class="dropdown-content">
                        <a href="#">Profile</a>
                        <a href="#">Settings</a>
                        <a href="#">Log Out</a>
                    </div>
                </div>
            </div>
        </ul>
    </header>`
});

export default navbarUser;
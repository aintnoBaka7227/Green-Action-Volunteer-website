// eslint-disable-next-line no-undef
Vue.component('site-footer', {
    template: `
        <footer>
            <div class="footer-container">
                <div class="footer-section">
                    <h3>About Us</h3>
                    <p><a href="/guests/about.html">Learn more about our mission and values.</a></p>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: info@greenaction.com</p>
                    <p>Phone: (123) 456-7890</p>
                    <p><a href="/guests/contact.html">Contact Form</a></p>
                </div>
                <div class="footer-section">
                    <h3>Follow Us</h3>
                    <div class="social-icons">
                        <a href="https://www.facebook.com/yourpage" target="_blank"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.twitter.com/yourpage" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/yourpage" target="_blank"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/yourpage" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/guests/updates.html">Updates</a></li>
                        <li><a href="/guests/events.html">Events</a></li>
                        <li><a href="/signups.html">Sign Up</a></li>
                        <li><a href="/logins.html">Log In</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Green Action. All rights reserved.</p>
            </div>
        </footer>
    `
});

// public/javascripts/Auth.js

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (!email || !password) {
      document.getElementById("loginWarning").innerText = "Required field is empty.";
      return;
  }

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
          if (this.status === 200) {
              document.getElementById("loginWarning").innerText = "Login successful";
              window.location.href = '/profile';
          } else if (this.status === 400) {
              document.getElementById("loginWarning").innerText = this.responseText;
          } else {
              document.getElementById("loginWarning").innerText = "An error occurred. Please try again later.";
          }
      }
  };

  xhttp.open("POST", '/users/login', true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ email, password }));
}

function signup() {
  let firstName = document.getElementById("first_name").value;
  let lastName = document.getElementById("last_name").value;
  let email = document.getElementById("email").value;
  let phoneNumber = document.getElementById("phone_number").value;
  let gender = document.getElementById("gender").value;
  let password = document.getElementById("password").value;
  let DOB = document.getElementById("DOB").value;

  if (!firstName || !lastName || !email || !phoneNumber || !gender || !password || !DOB) {
      document.getElementById("warning").innerText = "Required field is empty.";
      return;
  }

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
          if (this.status === 200) {
              document.getElementById("warning").innerText = "Signup successful";
              window.location.href = '/profile';
          } else if (this.status === 400) {
              document.getElementById("warning").innerText = this.responseText;
          } else {
              document.getElementById("warning").innerText = "An error occurred. Please try again later.";
          }
      }
  };

  xhttp.open("POST", '/users/signup', true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ firstName, lastName, email, phoneNumber, gender, password, DOB }));
}

function handleCredentialResponse(response) {
  let id_token = response.credential;
  googleLogin(id_token);
}

function googleLogin(idToken) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
          if (this.status === 200) {
              window.location.href = `/profile`;
          } else if (this.status === 400) {
              document.getElementById("loginWarning").innerText = this.responseText;
          } else {
              document.getElementById("loginWarning").innerText = "An error occurred. Please try again later.";
          }
      }
  };
  xhttp.open('POST', '/users/glogin', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify({ credential: idToken }));
}

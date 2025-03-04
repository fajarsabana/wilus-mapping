// auth.js - Handles user authentication

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            login();
        });
    }
    checkAuthentication();
});

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const validUsername = "admin";  // Change this to your preferred username
    const validPassword = "password123";  // Change this to your preferred password
    
    if (username === validUsername && password === validPassword) {
        localStorage.setItem("authenticated", "true");
        window.location.href = "index.html";
    } else {
        document.getElementById("error-message").innerText = "Invalid username or password!";
    }
}

function checkAuthentication() {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (!isAuthenticated && window.location.pathname.includes("index.html")) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("authenticated");
    window.location.href = "login.html";
}

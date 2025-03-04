document.addEventListener("DOMContentLoaded", function () {
    checkAuthentication();
});

const supabaseUrl = "https://jqueqchgsazhompvfifr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWVxY2hnc2F6aG9tcHZmaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM5MDIsImV4cCI6MjA1NjU0OTkwMn0.8q1m-jIL4kRgck4pwDfOYFHgFMSg2BIfBSTgIWBc_PE";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Hash password before checking
    const hashedPassword = await hashPassword(password);

    // Query Supabase for the user (now using RLS-secured view)
    let { data: user, error } = await supabase
        .from("user_secure")
        .select("*")
        .eq("username", username)
        .eq("password_hash", hashedPassword)
        .single();

    if (error || !user) {
        console.error("Login failed:", error ? error.message : "Invalid credentials");
        document.getElementById("error-message").innerText = "Invalid username or password!";
    } else {
        console.log("Login successful!", user);
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("username", username);  // Store username
        window.location.href = "index.html";
    }
}

function checkAuthentication() {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (!isAuthenticated && window.location.pathname.includes("index.html")) {
        console.log("Not authenticated! Redirecting to login...");
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

// Function to hash passwords using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

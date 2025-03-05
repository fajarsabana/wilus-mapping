import { supabase } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
    checkAuthentication();
});

async function checkAuthentication() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = "login.html";  // Redirects to login if not authenticated
    }
}

const supabaseUrl = "https://jqueqchgsazhompvfifr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWVxY2hnc2F6aG9tcHZmaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM5MDIsImV4cCI6MjA1NjU0OTkwMn0.8q1m-jIL4kRgck4pwDfOYFHgFMSg2BIfBSTgIWBc_PE";  // Replace with your actual Supabase anon key

async function loadData() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/wilus_mapping?select=UID,Nama%20Lokasi,Pemegang%20Wilus,geom`, {
            headers: {
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Supabase API Response:", data); // Debugging log

        if (!data || !Array.isArray(data)) {
            throw new Error("Supabase response is not an array or is empty.");
        }

        loadGeoJSON(data);
    } catch (error) {
        console.error("Error loading data from Supabase:", error);
    }
}

// Start fetching data on page load
loadData();

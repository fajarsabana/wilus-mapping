const supabaseUrl = "https://jqueqchgsazhompvfifr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWVxY2hnc2F6aG9tcHZmaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM5MDIsImV4cCI6MjA1NjU0OTkwMn0.8q1m-jIL4kRgck4pwDfOYFHgFMSg2BIfBSTgIWBc_PE";  // Paste your actual anon key here

async function loadData() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/wilus_mapping?select=*`, {
            headers: {
                "apikey": supabaseKey,  // Required API key
                "Authorization": `Bearer ${supabaseKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Data loaded from Supabase:", data); // Debugging log
        loadGeoJSON(data);  // Pass data to your map
    } catch (error) {
        console.error("Error loading data from Supabase:", error);
    }
}

loadData();

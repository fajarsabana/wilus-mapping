async function loadData() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/wilus_mapping?select=UID,Nama Lokasi,Pemegang Wilus,geom`, {
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
        console.log("Supabase API Response:", data);
        loadGeoJSON(data);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

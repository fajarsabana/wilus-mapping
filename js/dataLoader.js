import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://jqueqchgsazhompvfifr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWVxY2hnc2F6aG9tcHZmaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM5MDIsImV4cCI6MjA1NjU0OTkwMn0.8q1m-jIL4kRgck4pwDfOYFHgFMSg2BIfBSTgIWBc_PE"; // Use environment variable

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export async function loadGeoJSON() {
    try {
        const { data, error } = await supabase
            .from("wilus_mapping")
            .select("id, UID, geom, \"Pemegang Wilus\", \"Nama Lokasi\"");

        if (error) throw error;

        console.log("📡 Supabase Data Received:", data);

        return {
            type: "FeatureCollection",
            features: data.map(item => {
                let geometry = null;

                try {
                    // Ensure geom is a valid object
                    geometry = (typeof item.geom === "object") ? item.geom : JSON.parse(item.geom);
                } catch (err) {
                    console.error("❌ Error parsing geometry:", item.geom, err);
                }

                return {
                    type: "Feature",
                    geometry: geometry || null, // Ensure null if parsing fails
                    properties: {
                        Pemegang_Wilus: item["Pemegang Wilus"] || "No Data",
                        Nama_Lokasi: item["Nama Lokasi"] || "No Data",
                        UID: item.UID || "No UID"
                    }
                };
            }).filter(feature => feature.geometry !== null) // Remove invalid geometries
        };

    } catch (err) {
        console.error("❌ Error loading data from Supabase:", err);
        return null;
    }
}

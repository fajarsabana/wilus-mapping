import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://jqueqchgsazhompvfifr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWVxY2hnc2F6aG9tcHZmaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM5MDIsImV4cCI6MjA1NjU0OTkwMn0.8q1m-jIL4kRgck4pwDfOYFHgFMSg2BIfBSTgIWBc_PE";  // Replace with your actual API key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function loadGeoJSON() {
    try {
        const { data, error } = await supabase
            .from("wilus_mapping") // Replace with your actual table name
            .select("*");

        if (error) throw error;

        return {
            type: "FeatureCollection",
            features: data.map(item => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [item.longitude, item.latitude] // Adjust according to your schema
                },
                properties: {
                    Pemegang_Wilus: item.pemegang_wilus,
                    Nama_Lokasi: item.nama_lokasi
                }
            }))
        };
    } catch (err) {
        console.error("Error loading data from Supabase:", err);
        return null;
    }
}

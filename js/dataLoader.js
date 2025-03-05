import { supabase } from "./config.js";

async function loadData() {
    try {
        const { data, error } = await supabase
            .from("wilus_mapping")
            .select("UID, Nama Lokasi, Pemegang Wilus, geom");

        if (error) throw error;

        console.log("Supabase API Response:", data);
        if (data.length > 0) {
            loadGeoJSON(data);
        } else {
            console.warn("No data received from Supabase");
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

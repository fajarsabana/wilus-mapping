import { loadGeoJSON } from "./dataLoader.js";

// Function to extract Pemegang Wilus and Nama Lokasi
export function listWilus() {
    loadGeoJSON().then(data => {
        if (!data || !data.features) {
            console.error("Invalid GeoJSON data");
            return;
        }
        
        const wilusList = data.features.map(feature => {
            return {
                pemegangWilus: feature.properties.Pemegang_Wilus || "Unknown",
                namaLokasi: feature.properties.Nama_Lokasi || "Unknown"
            };
        });
        
        // Display the list in console for now (can be modified to update UI later)
        console.log("List of Pemegang Wilus:", wilusList);
        return wilusList;
    }).catch(error => console.error("Error loading GeoJSON:", error));
}

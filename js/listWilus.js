import { loadGeoJSON } from "./dataLoader.js";

export async function listWilus() {
    const data = await loadGeoJSON();

    if (!data || !data.features) {
        console.error("Invalid GeoJSON data");
        return [];
    }

    const wilusList = data.features.map(feature => ({
        pemegangWilus: feature.properties.Pemegang_Wilus || "No Data",
        namaLokasi: feature.properties.Nama_Lokasi || "No Data",
        uid: feature.properties.UID || "No UID"
    }));

    console.log("List of Pemegang Wilus:", wilusList);
    return wilusList;
}

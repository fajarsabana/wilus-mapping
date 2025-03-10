// Ensure geojson is properly assigned before accessing it
function listWilusLocations() {
    if (!geojson || !geojson.features) {
        console.error("GeoJSON data is missing or invalid.");
        return [];
    }

    const wilusList = geojson.features.map(feature => ({
        pemegangWilus: feature.properties.pemegangWilus,
        namaLokasi: feature.properties.namaLokasi
    }));

    console.log("Wilus List:", wilusList);
    return wilusList;
}

// Function to process and display Wilus data after geojson is ready
function processWilusData() {
    if (!geojson || !geojson.features || geojson.features.length === 0) {
        console.warn("GeoJSON data is not ready yet.");
        return;
    }

}

// 🔥 Modify loadGeoJSON in `dataLoader.js` to call processWilusData()
function loadGeoJSON(supabaseData) {
    if (!supabaseData || !Array.isArray(supabaseData)) {
        console.error("Invalid GeoJSON data from Supabase:", supabaseData);
        return;
    }

    geojson = {  
        "type": "FeatureCollection",
        "features": supabaseData.map(item => {
            if (!item["geom"]) {
                console.warn("Missing geometry for item:", item);
                return null;
            }

            let geometry;
            try {
                geometry = (typeof item["geom"] === "object") ? item["geom"] : JSON.parse(item["geom"]);
            } catch (error) {
                console.error("Error parsing geometry for item:", item, error);
                return null;
            }

            return {
                "type": "Feature",
                "properties": {
                    "uid": item["UID"] || "Unknown",
                    "namaLokasi": item["Nama Lokasi"] || "No Name",
                    "pemegangWilus": item["Pemegang Wilus"] || "No Group"
                },
                "geometry": geometry
            };
        }).filter(feature => feature !== null) 
    };

    console.log("Final GeoJSON for Map:", geojson);

    if (geojson.features.length === 0) {
        console.warn("No valid features found, skipping map update.");
        return;
    }

    // Add the GeoJSON to the map
    L.geoJSON(geojson, {
        style: function(feature) {
            return {
                color: "green",
                weight: 2,
                fillOpacity: 0.5
            };
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                let popupContent = `<b>${feature.properties.namaLokasi}</b><br>Pemegang Wilus: ${feature.properties.pemegangWilus}`;
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);

    function displayWilusList() {
    if (!geojson || !geojson.features) {
        console.error("GeoJSON data is missing or invalid.");
        return;
    }

    const wilusList = document.getElementById("wilus-list");
    wilusList.innerHTML = ""; // Clear previous content

    geojson.features.forEach(feature => {
        const pemegangWilus = feature.properties.pemegangWilus || "Unknown";
        const namaLokasi = feature.properties.namaLokasi || "No Name";

        const listItem = document.createElement("li");
        listItem.textContent = `🗺️ ${namaLokasi} - 📌 ${pemegangWilus}`;
        wilusList.appendChild(listItem);
    });

    console.log("Wilus List Displayed on Page.");
}

// ✅ Ensure this runs after `geojson` is loaded
function processWilusData() {
    if (!geojson || !geojson.features || geojson.features.length === 0) {
        console.warn("GeoJSON data is not ready yet.");
        return;
    }

    displayWilusList(); // Call this function to update index.html
}
}

let geojson = {}; // Define globally

function loadGeoJSON(supabaseData) {
    if (!supabaseData || !Array.isArray(supabaseData)) {
        console.error("Invalid GeoJSON data from Supabase:", supabaseData);
        return;
    }

    geojson = {  // Now assigns to the global variable
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
        }).filter(feature => feature !== null)  // Remove invalid features
    };

    console.log("Final GeoJSON for Map:", geojson);

    if (geojson.features.length === 0) {
        console.warn("No valid features found, skipping map update.");
        return;
    }

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
}

// Function to List Pemegang Wilus & Nama Lokasi
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

// Example usage: Call listWilusLocations() after geojson is loaded
function processWilusData() {
    const wilusData = listWilusLocations();
    wilusData.forEach(item => {
        console.log(`Pemegang Wilus: ${item.pemegangWilus}, Nama Lokasi: ${item.namaLokasi}`);
    });
}

// Call this function after data is fetched

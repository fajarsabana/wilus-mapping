function loadGeoJSON(supabaseData) {
    if (!supabaseData || !Array.isArray(supabaseData)) {
        console.error("Invalid GeoJSON data from Supabase:", supabaseData);
        return;
    }

    let geojson = {
        "type": "FeatureCollection",
        "features": supabaseData.map(item => {
            if (!item["geom"]) {
                console.warn("Missing geometry for item:", item);
                return null;
            }

            let geometry;
            try {
                // If `geom` is already an object, use it directly; otherwise, parse it
                geometry = (typeof item["geom"] === "object") ? item["geom"] : JSON.parse(item["geom"]);
            } catch (error) {
                console.error("Error parsing geometry for item:", item, error);
                return null;
            }

            return {
                "type": "Feature",
                "properties": {
                    "uid": item["UID"] || "Unknown",
                    "name": item["Nama Lokasi"] || "No Name",
                    "pemegang_wilus": item["Pemegang Wilus"] || "No Group"
                },
                "geometry": geometry
            };
        }).filter(feature => feature !== null)  // Remove invalid features
    };

    console.log("Final GeoJSON for Map:", geojson);

    // Check if there are valid features before adding them to the map
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
                let popupContent = `<b>${feature.properties.name}</b><br>Pemegang Wilus: ${feature.properties.pemegang_wilus}`;
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);
}

function listWilusLocations(geojson) {
    if (!geojson || !geojson.features) {
        console.error("GeoJSON data is missing or invalid.");
        return [];
    }

    const wilusList = geojson.features.map(feature => ({
        pemegangWilus: feature.properties["Pemegang Wilus"],
        namaLokasi: feature.properties["Nama Lokasi"]
    }));

    console.log(wilusList); // Debugging: log the list to console
    return wilusList;
}

// Example usage after geojson is loaded
if (typeof geojson !== 'undefined') {
    const wilusData = listWilusLocations(geojson);
    wilusData.forEach(item => {
        console.log(`Pemegang Wilus: ${item.pemegangWilus}, Nama Lokasi: ${item.namaLokasi}`);
    });
} else {
    console.error("GeoJSON data is not available yet.");
}



function loadGeoJSON(supabaseData) {
    if (!supabaseData || !Array.isArray(supabaseData)) {
        console.error("Invalid GeoJSON data from Supabase:", supabaseData);
        return;
    }

    let geojson = {
        "type": "FeatureCollection",
        "features": supabaseData.map(item => {
            if (!item.geom) {
                console.warn("Missing geometry for item:", item);
                return null;
            }

            try {
                return {
                    "type": "Feature",
                    "properties": {
                        "uid": item.uid || "Unknown",
                        "name": item.name || "No Name",
                        "grup": item.grup || "No Group"
                    },
                    "geometry": JSON.parse(item.geom)  // Convert JSON string to object
                };
            } catch (error) {
                console.error("Error parsing geometry for item:", item, error);
                return null;
            }
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
                let popupContent = `<b>${feature.properties.name}</b><br>Group: ${feature.properties.grup}`;
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);
}

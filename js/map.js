// Function to reload the map layers dynamically
function reloadMap(geojsonData) {
    if (!geojsonData || !geojsonData.features) {
        console.warn("⚠️ No valid data to reload the map.");
        return;
    }

    console.log("🗺️ Reloading map with data:", geojsonData);

    // Remove existing layers
    if (window.wilusLayer) {
        map.removeLayer(window.wilusLayer);
    }

    // Ensure valid geometry exists before adding
    const validFeatures = geojsonData.features.filter(feature => feature.geometry !== null);
    
    if (validFeatures.length === 0) {
        console.warn("❌ No valid features to display.");
        return;
    }

    console.log("✅ Adding", validFeatures.length, "features to the map.");

    window.wilusLayer = L.geoJSON({ type: "FeatureCollection", features: validFeatures }, {
        style: function(feature) {
            return { color: "green", weight: 2, fillOpacity: 0.5 };
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                let popupContent = `<b>${feature.properties.name}</b><br>Pemegang Wilus: ${feature.properties.pemegang_wilus}`;
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);
}

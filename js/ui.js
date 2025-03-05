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
                geometry = JSON.parse(item["geom"]);
} catch (error) {
                console.error("Error parsing geometry for item:", item, error);
                console.error("Error parsing geometry:", error, "Data:", item);
return null;
}

return {
"type": "Feature",
                "properties": {
                    "uid": item["UID"] || "Unknown",
                    "name": item["Nama Lokasi"] || "No Name",
                    "pemegang_wilus": item["Pemegang Wilus"] || "No Group"
                "properties": { 
                    "name": item["Nama Lokasi"], 
                    "owner": item["Pemegang Wilus"] 
},
"geometry": geometry
};
        }).filter(feature => feature !== null)  // Remove invalid features
        }).filter(feature => feature !== null)
};

    console.log("Final GeoJSON for Map:", geojson);
    updateFilterOptions(supabaseData);
    applyFilter(geojson);
}

    // Check if there are valid features before adding them to the map
    if (geojson.features.length === 0) {
        console.warn("No valid features found, skipping map update.");
        return;
// Ensure filter dropdown is populated with unique owner names
function updateFilterOptions(supabaseData) {
    let filterDropdown = document.getElementById("filterDropdown");
    filterDropdown.innerHTML = '<option value="all">All</option>'; 

    let uniqueOwners = [...new Set(supabaseData.map(item => item["Pemegang Wilus"]))];
    uniqueOwners.forEach(owner => {
        let option = document.createElement("option");
        option.value = owner;
        option.textContent = owner;
        filterDropdown.appendChild(option);
    });

    filterDropdown.addEventListener("change", () => applyFilter());
}

// Apply filtering logic
function applyFilter() {
    let selectedOwner = document.getElementById("filterDropdown").value;
    
    let filteredFeatures = geojson.features.filter(feature => 
        selectedOwner === "all" || feature.properties.owner === selectedOwner
    );

    if (filteredFeatures.length === 0) {
        console.warn("⚠️ No matching data for selected filter.");
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
    // Clear existing map layers
    map.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
}
    }).addTo(map);
    });

    // Add filtered features back to the map
    L.geoJSON({ "type": "FeatureCollection", "features": filteredFeatures }).addTo(map);
}

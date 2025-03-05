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
                geometry = JSON.parse(item["geom"]);
            } catch (error) {
                console.error("Error parsing geometry:", error, "Data:", item);
                return null;
            }

            return {
                "type": "Feature",
                "properties": { 
                    "name": item["Nama Lokasi"], 
                    "owner": item["Pemegang Wilus"] 
                },
                "geometry": geometry
            };
        }).filter(feature => feature !== null)
    };

    updateFilterOptions(supabaseData);
    applyFilter(geojson);
}

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

    // Clear existing map layers
    map.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    // Add filtered features back to the map
    L.geoJSON({ "type": "FeatureCollection", "features": filteredFeatures }).addTo(map);
}

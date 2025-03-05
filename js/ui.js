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

function updateCompanyFilters(supabaseData) {
    let filterContainer = document.getElementById("company-filters"); 
    
    if (!filterContainer) {
        console.error("❌ ERROR: 'company-filters' div not found in HTML!");
        return;
    }

    filterContainer.innerHTML = ""; // Clear old content

    let label = document.createElement("label");
    label.textContent = "Filter by Company: ";
    filterContainer.appendChild(label);

    let filterDropdown = document.createElement("select");
    filterDropdown.id = "filterDropdown";
    filterDropdown.innerHTML = '<option value="all">All</option>'; // Default option

    // Get unique company names
    let uniqueCompanies = [...new Set(supabaseData.map(item => item["Pemegang Wilus"]))];

    uniqueCompanies.forEach(company => {
        let option = document.createElement("option");
        option.value = company;
        option.textContent = company;
        filterDropdown.appendChild(option);
    });

    filterContainer.appendChild(filterDropdown);

    // 🚀 Pastikan event listener KE-TRIGGER PAS dropdown ada
    filterDropdown.addEventListener("change", applyFilter);

    console.log("🟢 SUCCESS: Filter dropdown added!");
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

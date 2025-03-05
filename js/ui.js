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
updateCompanyFilters(supabaseData);
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

    // Get unique company names from the dataset
    let uniqueCompanies = [...new Set(supabaseData.map(item => item["Pemegang Wilus"]))];

    uniqueCompanies.forEach(company => {
        let option = document.createElement("option");
        option.value = company;
        option.textContent = company;
        filterDropdown.appendChild(option);
    });

    filterContainer.appendChild(filterDropdown);

    // 🚀 Make sure filter applies when selected
    filterDropdown.addEventListener("change", () => {
        applyFilter(filterDropdown.value);
    });

    console.log("🟢 SUCCESS: Filter dropdown added!");
}

// Ensure filter applies to map
function applyFilter(selectedCompany) {
    let filteredFeatures = geojson.features.filter(feature => 
        selectedCompany === "all" || feature.properties.owner === selectedCompany
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


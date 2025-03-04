function populateCompanyFilters(companiesAndLocations) {
    const filterContainer = document.getElementById("company-filters");
    filterContainer.innerHTML = ""; 

    companiesAndLocations.forEach(item => {
        let listItem = document.createElement("div");
        listItem.className = "company-item";
        listItem.textContent = `${item.pemegang_wilus} - ${item.nama_lokasi}`;
        listItem.dataset.uid = item.uid; // Store UID to find it on the map

        // ✅ On click, zoom to that feature
        listItem.addEventListener("click", function() {
            zoomToFeature(item.uid);
        });

        filterContainer.appendChild(listItem);
    });
}

// ✅ Function to zoom into the selected feature
function zoomToFeature(uid) {
    if (!geojsonLayer) {
        console.error("GeoJSON Layer not loaded yet!");
        return;
    }

    let targetLayer = null;
    geojsonLayer.eachLayer(layer => {
        if (layer.feature.properties.uid === uid) {
            targetLayer = layer;
        }
    });

    if (targetLayer) {
        map.fitBounds(targetLayer.getBounds()); // Zoom to feature
        targetLayer.openPopup(); // Show popup
    } else {
        console.warn("Feature not found for UID:", uid);
    }
}

// ✅ Modify `loadGeoJSON` to generate a list of "Pemegang Wilus" & "Nama Lokasi"
function loadGeoJSON(supabaseData) {
    if (!supabaseData || !Array.isArray(supabaseData)) {
        console.error("Invalid GeoJSON data from Supabase:", supabaseData);
        return;
    }

    geojsonData = {
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
                    "name": item["Nama Lokasi"] || "No Name",
                    "pemegang_wilus": item["Pemegang Wilus"] || "No Group"
                },
                "geometry": geometry
            };
        }).filter(feature => feature !== null)
    };

    console.log("Final GeoJSON for Map:", geojsonData);
    updateMap(geojsonData);

    // ✅ Pass list of names & companies for sidebar listing
    populateCompanyFilters(supabaseData.map(item => ({
        uid: item["UID"],
        nama_lokasi: item["Nama Lokasi"],
        pemegang_wilus: item["Pemegang Wilus"]
    })));
}

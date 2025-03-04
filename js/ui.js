function populateCompanyFilters(companiesAndLocations) {
    const filterContainer = document.getElementById("company-filters");
    filterContainer.innerHTML = ""; 

    companiesAndLocations.forEach(item => {
        let listItem = document.createElement("div");
        listItem.className = "company-item";
        listItem.textContent = `${item.pemegang_wilus} - ${item.nama_lokasi}`;
        listItem.dataset.uid = item.uid;

        listItem.addEventListener("click", function() {
            zoomToFeature(item.uid);
        });

        filterContainer.appendChild(listItem);
    });
}

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
        try {
            // ✅ Cek apakah fitur punya bounds (area), kalau tidak, zoom ke titiknya
            const bounds = targetLayer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
                targetLayer.openPopup();
            } else {
                console.warn(`Invalid bounds for feature ${uid}, using setView instead.`);
                const latlng = targetLayer.getLatLng ? targetLayer.getLatLng() : null;
                if (latlng) {
                    map.setView(latlng, 14); // Gunakan zoom level 14 untuk titik
                    targetLayer.openPopup();
                } else {
                    console.warn(`Feature ${uid} has no valid bounds or coordinates.`);
                }
            }
        } catch (error) {
            console.error("Error zooming to feature:", uid, error);
        }
    } else {
        console.warn(`Feature not found for UID: ${uid}`);
    }
}


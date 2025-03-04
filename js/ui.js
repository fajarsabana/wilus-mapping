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

    // ✅ Cari fitur berdasarkan UID yang sesuai
    geojsonLayer.eachLayer(layer => {
        if (layer.feature && layer.feature.properties && layer.feature.properties.uid === uid) {
            targetLayer = layer;
        }
    });

    if (targetLayer) {
        try {
            if (targetLayer.getBounds) {
                const bounds = targetLayer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                    targetLayer.openPopup();
                    return;
                }
            }
            
            // ✅ Jika fitur tidak punya bounds (hanya titik), zoom ke titiknya
            if (targetLayer.getLatLng) {
                const latlng = targetLayer.getLatLng();
                map.setView(latlng, 14);
                targetLayer.openPopup();
            } else {
                console.warn(`Feature ${uid} has no valid bounds or coordinates.`);
            }
        } catch (error) {
            console.error(`Error zooming to feature UID: ${uid}`, error);
        }
    } else {
        console.warn(`Feature not found for UID: ${uid}`);
    }
}

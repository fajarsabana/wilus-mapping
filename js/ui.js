function populateCompanyFilters(companiesAndLocations) {
    const filterContainer = document.getElementById("company-filters");
    filterContainer.innerHTML = ""; 

    companiesAndLocations.forEach(item => {
        let listItem = document.createElement("div");
        listItem.className = "company-item";
        listItem.textContent = `${item.pemegang_wilus} - ${item.nama_lokasi}`;
        listItem.dataset.uid = item.uid;

        // ✅ Clicking will zoom to that feature
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

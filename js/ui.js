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

    // ✅ Cari fitur yang benar-benar cocok dengan UID
    geojsonLayer.eachLayer(layer => {
        if (layer.feature && layer.feature.properties && layer.feature.properties.uid.trim() === uid.trim()) {
            targetLayer = layer;
        }
    });

    if (!targetLayer) {
        console.warn(`❌ Feature dengan UID "${uid}" tidak ditemukan.`);
        alert(`⚠️ Data untuk "${uid}" tidak ditemukan di peta.`);
        return;
    }

    try {
        // ✅ Debugging: Pastikan kita menemukan UID yang benar
        console.log(`🔍 Debugging UID "${uid}"`, targetLayer.feature);

        if (!targetLayer.feature.geometry) {
            console.warn(`❌ Feature UID "${uid}" tidak memiliki geometry.`);
            alert(`⚠️ Data untuk "${uid}" tidak memiliki bentuk wilayah.`);
            return;
        }

        // ✅ Jika fitur adalah polygon, gunakan fitBounds()
        if (targetLayer.getBounds && typeof targetLayer.getBounds === "function") {
            const bounds = targetLayer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
                targetLayer.openPopup();
                return;
            }
        }
        
        // ✅ Jika fitur adalah titik, gunakan setView()
        if (targetLayer.getLatLng && typeof targetLayer.getLatLng === "function") {
            const latlng = targetLayer.getLatLng();
            if (latlng) {
                map.setView(latlng, 14); // Zoom level 14 untuk titik
                targetLayer.openPopup();
                return;
            }
        }

        // ❌ Jika tidak punya bounds atau koordinat, tampilkan peringatan
        console.warn(`❌ Feature UID "${uid}" tidak memiliki lokasi.`);
        alert(`⚠️ Data untuk "${uid}" tidak memiliki lokasi yang bisa difokuskan.`);
    } catch (error) {
        console.error(`❌ Error saat zoom ke UID: ${uid}`, error);
    }
}



function populateCompanyFilters(companiesAndLocations) {
    const filterContainer = document.getElementById("company-filters");
    filterContainer.innerHTML = ""; 

    // ✅ Ensure we get unique "Pemegang Wilus" values
    const uniqueWilus = [...new Set(companiesAndLocations.map(item => item.pemegang_wilus))];

    uniqueWilus.forEach(pemegangWilus => {
        let listItem = document.createElement("div");
        listItem.className = "company-item";
        listItem.textContent = pemegangWilus;

        listItem.addEventListener("click", function() {
            zoomToFeature(pemegangWilus); // ✅ Click event highlights & zooms
        });

        filterContainer.appendChild(listItem);
    });
}

let lastSelectedLayer = null; // Store the last highlighted shape

function zoomToFeature(pemegangWilus) {
    if (!geojsonLayer) {
        console.error("GeoJSON Layer not loaded yet!");
        return;
    }

    let targetLayers = [];

    // ✅ Find all features that belong to the selected "Pemegang Wilus"
    geojsonLayer.eachLayer(layer => {
        if (layer.feature && layer.feature.properties && layer.feature.properties.pemegang_wilus.trim() === pemegangWilus.trim()) {
            targetLayers.push(layer);
        }
    });

    if (targetLayers.length === 0) {
        console.warn(`❌ No features found for Pemegang Wilus: "${pemegangWilus}"`);
        alert(`⚠️ No location found for "${pemegangWilus}"`);
        return;
    }

    console.log(`✅ Clicked on: ${pemegangWilus}`);
    console.log("🔍 Found Features:", targetLayers);

    let bounds = null;
    let pointCoordinates = null;

    // ✅ Reset all shapes to original color before highlighting the new one
    geojsonLayer.eachLayer(layer => {
        if (layer.feature && layer.feature.properties) {
            layer.setStyle({
                color: layer.feature.properties.originalColor,
                weight: 2,
                fillOpacity: 0.5
            });
        }
    });

    targetLayers.forEach(layer => {
        if (layer.feature.geometry.type === "Polygon" || layer.feature.geometry.type === "MultiPolygon") {
            if (!bounds) {
                bounds = layer.getBounds();
            } else {
                bounds.extend(layer.getBounds());
            }

            // ✅ Highlight the selected Pemegang Wilus
            layer.setStyle({
                color: "#ff0000", // Highlight in red
                weight: 4, // Make border thicker
                fillOpacity: 0.7
            });

            lastSelectedLayer = layer; // Store the last highlighted shape
        } else if (layer.feature.geometry.type === "Point") {
            pointCoordinates = layer.feature.geometry.coordinates;
        }
    });

    // ✅ Perform the zooming action
    if (bounds) {
        console.log(`📍 Zooming to area of "${pemegangWilus}"`);
        map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pointCoordinates) {
        console.log(`📍 Zooming to point location of "${pemegangWilus}" at:`, pointCoordinates);
        map.setView([pointCoordinates[1], pointCoordinates[0]], 14);
    } else {
        console.warn(`❌ "${pemegangWilus}" has no valid geometry`);
        alert(`⚠️ No valid geometry for "${pemegangWilus}"`);
    }
}

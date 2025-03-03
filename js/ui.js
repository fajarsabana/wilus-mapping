// Initialize the map if it doesn't exist already
if (!window.map) {
    window.map = L.map('map', {
        center: [3.666854, 98.66797],
        zoom: 12,
        scrollWheelZoom: true, 
        zoomControl: true 
    });

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);
}

var companyLayers = {}; 
var geojsonData = null; // Global variable to store GeoJSON data
var coordinateMarker = null; // Marker for checked coordinate

window.loadGeoJSON = function(data) {
    geojsonData = data; // Store the loaded GeoJSON data
    var filterContainer = document.getElementById("company-filters");
    companyLayers = {}; 

    data.features.forEach(feature => {
        let companyName = feature.properties["Nama Lokasi"] || "Unknown";

        if (!feature.geometry || !feature.geometry.coordinates) {
            return;
        }

        if (!companyLayers[companyName]) {
            companyLayers[companyName] = L.layerGroup();
        }

        try {
            let layer = L.geoJSON(feature, {
                style: {
                    color: "blue",
                    weight: 2,
                    fillOpacity: 0.5
                },
                onEachFeature: function(feature, layer) {
                    let areaName = feature.properties["Nama Lokasi"] || "Unnamed Area";
                    layer.bindPopup(`<b>${areaName}</b>`);

                    layer.on("mouseover", function () {
                        if (layer.setStyle) {
                            layer.setStyle({ weight: 4, fillOpacity: 0.7 });
                        }
                    });
                    layer.on("mouseout", function () {
                        if (layer.setStyle) {
                            layer.setStyle({ weight: 2, fillOpacity: 0.5 });
                        }
                    });
                }
            });

            companyLayers[companyName].addLayer(layer);
        } catch (error) {}
    });

    filterContainer.innerHTML = "";

    for (let company in companyLayers) {
        let button = document.createElement("button");
        button.innerText = company;
        button.classList.add("company-button");
        button.addEventListener("click", function() {
            window.focusOnCompany(company);
        });
        filterContainer.appendChild(button);
    }

    for (let company in companyLayers) {
        companyLayers[company].addTo(window.map);
    }
};

window.focusOnCompany = function(company) {
    if (companyLayers[company]) {
        let bounds = L.latLngBounds();
        companyLayers[company].eachLayer(layer => {
            if (layer.getBounds) {
                bounds.extend(layer.getBounds());
            }
        });
        if (bounds.isValid()) {
            window.map.fitBounds(bounds);
        }
    }
};

// Function to check if a coordinate belongs to a "Nama Lokasi", place a marker, and focus the map
window.checkCoordinate = function() {
    console.log("✅ Button clicked, function triggered.");

    let lat = parseFloat(document.getElementById("latInput").value);
    let lng = parseFloat(document.getElementById("lngInput").value);
    let resultElement = document.getElementById("result");

    if (isNaN(lat) || isNaN(lng)) {
        console.log("❌ Invalid coordinates provided.");
        resultElement.innerText = "❌ Please enter valid coordinates.";
        return;
    }

    console.log(`🔍 Checking coordinates: ${lat}, ${lng}`);

    if (!geojsonData || !geojsonData.features) {
        console.error("❌ GeoJSON data is not loaded or invalid.");
        resultElement.innerText = "❌ Map data not loaded yet!";
        return;
    }

    let point = turf.point([lng, lat]);
    let foundLocation = "❌ Not inside any area";
    let insidePolygon = false;

    geojsonData.features.forEach(feature => {
        if (!feature.geometry || !feature.geometry.coordinates) {
            console.warn("⚠️ Skipping invalid feature:", feature);
            return;
        }

        if (feature.geometry.type === "Point") {
            console.warn("⚠️ Skipping Point feature:", feature);
            return;
        }

        try {
            let isInside = false;

            if (feature.geometry.type === "Polygon") {
                let polygon = turf.polygon(feature.geometry.coordinates);
                isInside = turf.booleanPointInPolygon(point, polygon);
            } else if (feature.geometry.type === "MultiPolygon") {
                feature.geometry.coordinates.forEach(coords => {
                    let polygon = turf.polygon(coords);
                    if (turf.booleanPointInPolygon(point, polygon)) {
                        isInside = true;
                    }
                });
            }

            if (isInside) {
                insidePolygon = true;
                foundLocation = `✅ Inside: ${feature.properties["Nama Lokasi"]}`;
            }
        } catch (error) {
            console.error("❌ Error processing feature:", feature, error);
        }
    });

    // If inside Indonesia but not inside any defined polygon, show PLN
    let indonesiaBounds = turf.polygon([[ [95, -11], [141, -11], [141, 6], [95, 6], [95, -11] ]]);
    if (!insidePolygon && turf.booleanPointInPolygon(point, indonesiaBounds)) {
        foundLocation = "✅ Inside Indonesia but outside all defined areas → PLN";
    }

    console.log("🏁 Result:", foundLocation);
    resultElement.innerText = foundLocation;

    // Remove previous marker if exists
    if (coordinateMarker) {
        window.map.removeLayer(coordinateMarker);
    }

    // Add a marker at the input coordinate
    coordinateMarker = L.marker([lat, lng]).addTo(window.map)
        .bindPopup(`Checked Location: ${lat}, ${lng}`)
        .openPopup();

    // Move map focus to the entered coordinate
    window.map.setView([lat, lng], 14);
};

var map = L.map('map', {
    center: [3.666854, 98.66797],
    zoom: 12,
    scrollWheelZoom: true,
    zoomControl: true
});

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.getContainer().style.zIndex = "0";

let geojsonLayer;
let geojsonData = { "type": "FeatureCollection", "features": [] };

function updateMap(filteredData) {
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }
    geojsonLayer = L.geoJSON(filteredData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.company}`);
        }
    }).addTo(map);
}

function applyFilters() {
    const selectedCompanies = [...document.querySelectorAll('#company-filters input:checked')].map(el => el.value);
    const filteredData = geojsonData.features.filter(feature => selectedCompanies.includes(feature.properties.company));
    updateMap({ "type": "FeatureCollection", "features": filteredData });
}

document.getElementById("company-filters").addEventListener("change", applyFilters);

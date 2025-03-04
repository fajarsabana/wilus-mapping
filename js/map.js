var map = L.map('map', {
    center: [3.666854, 98.66797],
    zoom: 6,
    scrollWheelZoom: true,
    zoomControl: true
});

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.getContainer().style.zIndex = "0";

let geojsonLayer;
let geojsonData = { "type": "FeatureCollection", "features": [] };

// Unique colors for each company
const companyColors = {};
function getCompanyColor(company) {
    if (!companyColors[company]) {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        companyColors[company] = randomColor;
    }
    return companyColors[company];
}

// Function to add data to the map
function updateMap(filteredData) {
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    geojsonLayer = L.geoJSON(filteredData, {
        style: function(feature) {
            return { color: getCompanyColor(feature.properties.company), weight: 2 };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.company}`);
        }
    }).addTo(map);
}

// Apply filter when checkboxes are clicked
function applyFilters() {
    const selectedCompanies = [...document.querySelectorAll('#company-filters input:checked')].map(el => el.value);
    const filteredData = geojsonData.features.filter(feature => selectedCompanies.includes(feature.properties.company));

    console.log("Filtered Data:", filteredData); // Debugging
    updateMap({ "type": "FeatureCollection", "features": filteredData });
}

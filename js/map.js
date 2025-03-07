// Initialize the map
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

// Ensure UI elements remain on top
map.getContainer().style.zIndex = "0";

// Function to reload the map layers dynamically
function reloadMap(geojsonData) {
    if (!geojsonData || !geojsonData.features) {
        console.warn("No valid data to reload the map.");
        return;
    }

    // Remove existing layers
    if (window.wilusLayer) {
        map.removeLayer(window.wilusLayer);
    }

    // Add new data to the map
    window.wilusLayer = L.geoJSON(geojsonData, {
        style: function(feature) {
            return { color: "green", weight: 2, fillOpacity: 0.5 };
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                let popupContent = `<b>${feature.properties.name}</b><br>Pemegang Wilus: ${feature.properties.pemegang_wilus}`;
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);
}

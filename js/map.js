// Initialize the map
var map = L.map('map', {
  center: [3.666854, 98.66797],
  zoom: 12,
  scrollWheelZoom: true, // Enable scroll zoom
  zoomControl: true // Ensure zoom controls are visible
});

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Ensure UI elements remain on top
map.getContainer().style.zIndex = "0";

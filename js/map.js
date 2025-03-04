var map = L.map('map', {
    center: [3.666854, 98.66797],
    zoom: 6,
    scrollWheelZoom: true,
    zoomControl: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.getContainer().style.zIndex = "0";

let geojsonLayer;

// ✅ Fix JSON parsing issue
function loadGeoJSON(supabaseData) {
    let geojson = {
        "type": "FeatureCollection",
        "features": supabaseData.map(item => ({
            "type": "Feature",
            "properties": {
                "uid": item["UID"],
                "name": item["Nama Lokasi"],
                "pemegang_wilus": item["Pemegang Wilus"]
            },
            "geometry": typeof item["geom"] === "string" ? JSON.parse(item["geom"]) : item["geom"] // FIXED
        }))
    };

    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    geojsonLayer = L.geoJSON(geojson, {
        style: function(feature) {
            return { color: getCompanyColor(feature.properties.pemegang_wilus), weight: 2, fillOpacity: 0.5 };
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<b>${feature.properties.name}</b><br>Pemegang Wilus: ${feature.properties.pemegang_wilus}`);
        }
    }).addTo(map);

    populateCompanyFilters(supabaseData.map(item => ({
        uid: item["UID"],
        nama_lokasi: item["Nama Lokasi"],
        pemegang_wilus: item["Pemegang Wilus"]
    })));
}

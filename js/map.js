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

// ✅ Fix JSON parsing once and for all
function loadGeoJSON(supabaseData) {
    let geojson = {
        "type": "FeatureCollection",
        "features": supabaseData.map(item => {
            let geometry;
            try {
                // ✅ Ensure `geom` is parsed correctly
                geometry = typeof item["geom"] === "string" ? JSON.parse(item["geom"]) : item["geom"];
                if (!geometry || !geometry.type) {
                    console.warn("Invalid geometry detected:", item);
                    return null; // Skip invalid data
                }
            } catch (error) {
                console.error("Error parsing geometry:", item, error);
                return null; // Skip broken data
            }

            return {
                "type": "Feature",
                "properties": {
                    "uid": item["UID"],
                    "name": item["Nama Lokasi"],
                    "pemegang_wilus": item["Pemegang Wilus"]
                },
                "geometry": geometry
            };
        }).filter(feature => feature !== null) // ✅ Remove broken entries
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

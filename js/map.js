var map = L.map('map', {
    center: [-2.5, 120.0], // Adjusted center (closer to Central Sulawesi)
    zoom: 5.2, // Slightly higher zoom to balance Java, Sumatra & Papua
    scrollWheelZoom: true,
    zoomControl: true
});



L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.getContainer().style.zIndex = "0";

let geojsonLayer;

// ✅ Restore getCompanyColor() function
const companyColors = {};
function getCompanyColor(company) {
    if (!companyColors[company]) {
        companyColors[company] = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }
    return companyColors[company];
}

// ✅ Fix JSON parsing issue & make sure it handles errors correctly
function loadGeoJSON(supabaseData) {
    let geojson = {
        "type": "FeatureCollection",
        "features": supabaseData.map(item => {
            let geometry;
            try {
                geometry = typeof item["geom"] === "string" ? JSON.parse(item["geom"]) : item["geom"];
                if (!geometry || !geometry.type) {
                    console.warn("Invalid geometry detected:", item);
                    return null;
                }
            } catch (error) {
                console.error("Error parsing geometry:", item, error);
                return null;
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
        }).filter(feature => feature !== null)
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

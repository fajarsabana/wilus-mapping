// ✅ Reverting to the version that worked before
var map = L.map('map', {
    center: [3.666854, 98.66797],
    zoom: 6,
    scrollWheelZoom: true,
    zoomControl: true
});

// ✅ Keep existing working tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.getContainer().style.zIndex = "0";

let geojsonLayer;

// ✅ Keep colors for each company
const companyColors = {};
function getCompanyColor(company) {
    if (!companyColors[company]) {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        companyColors[company] = randomColor;
    }
    return companyColors[company];
}

// ✅ Keep working shape loading logic
function loadGeoJSON(supabaseData) {
    if (!supabaseData || !Array.isArray(supabaseData)) {
        console.error("Invalid GeoJSON data from Supabase:", supabaseData);
        return;
    }

    let geojson = {
        "type": "FeatureCollection",
        "features": supabaseData.map(item => ({
            "type": "Feature",
            "properties": {
                "uid": item["UID"] || "Unknown",
                "name": item["Nama Lokasi"] || "No Name",
                "pemegang_wilus": item["Pemegang Wilus"] || "No Group"
            },
            "geometry": JSON.parse(item["geom"])
        }))
    };

    console.log("Final GeoJSON for Map:", geojson);

    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    geojsonLayer = L.geoJSON(geojson, {
        style: function(feature) {
            return { 
                color: getCompanyColor(feature.properties.pemegang_wilus), 
                weight: 2, 
                fillOpacity: 0.5 
            };
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                let popupContent = `<b>${feature.properties.name}</b><br>Pemegang Wilus: ${feature.properties.pemegang_wilus}`;
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);

    // ✅ Keep working sidebar logic
    populateCompanyFilters(supabaseData.map(item => ({
        uid: item["UID"],
        nama_lokasi: item["Nama Lokasi"],
        pemegang_wilus: item["Pemegang Wilus"]
    })));
}

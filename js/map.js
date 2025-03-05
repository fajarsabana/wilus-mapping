function loadGeoJSON(data) {
    const map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    data.forEach(item => {
        if (item.geom) {
            const geoJsonFeature = {
                "type": "Feature",
                "properties": { "name": item["Nama Lokasi"], "owner": item["Pemegang Wilus"] },
                "geometry": JSON.parse(item.geom)
            };
            L.geoJSON(geoJsonFeature).addTo(map);
        }
    });
}

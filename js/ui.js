function populateCompanyFilters(companies) {
    const filterContainer = document.getElementById("company-filters");
    filterContainer.innerHTML = ""; // Clear previous filters

    companies.forEach(company => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = company;
        checkbox.id = `filter-${company}`;
        checkbox.checked = true; // Default to checked

        let label = document.createElement("label");
        label.htmlFor = `filter-${company}`;
        label.textContent = company;

        let div = document.createElement("div");
        div.appendChild(checkbox);
        div.appendChild(label);

        filterContainer.appendChild(div);
    });

    // ✅ FIX: Make sure the filter event listener is added after UI is populated
    document.getElementById("company-filters").addEventListener("change", applyFilters);
}

async function loadDataAndApplyFilters() {
    const data = await loadData();

    // ✅ FIX: Ensure geojsonData is properly formatted
    geojsonData = {
        "type": "FeatureCollection",
        "features": data.map(item => ({
            "type": "Feature",
            "properties": {
                "UID": item.UID,
                "name": item["Nama Lokasi"],
                "company": item["Pemegang Wilus"]
            },
            "geometry": JSON.parse(item.geom) // Convert string to GeoJSON object
        }))
    };

    const companies = [...new Set(data.map(item => item["Pemegang Wilus"]))];
    populateCompanyFilters(companies);

    updateMap(geojsonData); // ✅ FIX: Ensure the full map loads initially
}

document.addEventListener("DOMContentLoaded", loadDataAndApplyFilters);

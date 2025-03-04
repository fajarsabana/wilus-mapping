function populateCompanyFilters(companies) {
    const filterContainer = document.getElementById("company-filters");
    filterContainer.innerHTML = ""; 

    companies.forEach(company => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = company;
        checkbox.id = `filter-${company}`;
        checkbox.checked = true; 

        let label = document.createElement("label");
        label.htmlFor = `filter-${company}`;
        label.textContent = company;

        let div = document.createElement("div");
        div.appendChild(checkbox);
        div.appendChild(label);

        filterContainer.appendChild(div);
    });

    document.getElementById("company-filters").addEventListener("change", applyFilters);
}

async function loadDataAndApplyFilters() {
    const data = await loadData();

    geojsonData = {
        "type": "FeatureCollection",
        "features": data.map(item => ({
            "type": "Feature",
            "properties": {
                "UID": item.UID,
                "name": item["Nama Lokasi"],
                "company": item["Pemegang Wilus"]
            },
            "geometry": JSON.parse(item.geom)
        }))
    };

    console.log("GeoJSON Data Loaded:", geojsonData); // Debugging
    const companies = [...new Set(data.map(item => item["Pemegang Wilus"]))];
    populateCompanyFilters(companies);
    updateMap(geojsonData); // Show all shapes initially
}

document.addEventListener("DOMContentLoaded", loadDataAndApplyFilters);

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

    // ✅ FIX: Ensure the filter event listener is added correctly
    document.getElementById("company-filters").addEventListener("change", applyFilters);
}

function applyFilters() {
    const selectedCompanies = [...document.querySelectorAll('#company-filters input:checked')].map(el => el.value);
    console.log("Selected Companies:", selectedCompanies); // Debugging

    if (!geojsonLayer) {
        console.error("GeoJSON Layer not found!");
        return;
    }

    // ✅ FIX: Apply filtering based on company selection
    geojsonLayer.eachLayer(layer => {
        const company = layer.feature.properties.pemegang_wilus;
        if (selectedCompanies.includes(company)) {
            layer.setStyle({ opacity: 1, fillOpacity: 0.5 });
        } else {
            layer.setStyle({ opacity: 0, fillOpacity: 0 });
        }
    });
}

import { listWilus } from "./listWilus.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🟢 UI Initialized.");
    await displayWilusList();
});

async function displayWilusList() {
    const listContainer = document.getElementById("wilus-list");
    
    if (!listContainer) { 
        console.error("❌ ERROR: Sidebar list container not found!"); 
        return; 
    }

    console.log("📡 Fetching Wilus list...");
    const data = await listWilus();
    
    if (!data || data.length === 0) {
        console.warn("⚠️ No Wilus data found.");
        listContainer.innerHTML = "<p>No data available.</p>";
        return;
    }

    console.log("✅ Wilus data received:", data);

    listContainer.innerHTML = ""; // Clear previous content
    data.forEach(item => {
        const listItem = document.createElement("p");
        listItem.textContent = `${item.pemegangWilus} - ${item.namaLokasi}`;
        listContainer.appendChild(listItem);
    });
}

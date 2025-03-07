import { listWilus } from "./listWilus.js";

document.addEventListener("DOMContentLoaded", async () => {
    await displayWilusList();
});

async function displayWilusList() {
    const listContainer = document.getElementById("wilus-list");
    if (!listContainer) { 
        console.error("Sidebar list container not found!"); 
        return; 
    }

    const data = await listWilus();

    listContainer.innerHTML = ""; // Clear previous content
    data.forEach(item => {
        const listItem = document.createElement("p");
        listItem.textContent = `${item.pemegangWilus} - ${item.namaLokasi}`;
        listContainer.appendChild(listItem);
    });
}

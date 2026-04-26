import {
  fetchAplicacionesData,
  fetchStoreData,
  normalizeAssetPath,
} from "./api.js";

async function cargarAplicaciones() {
  const appsContainer = document.getElementById("apps-container");
  if (!appsContainer) return;

  try {
    const data = await fetchAplicacionesData();
    appsContainer.innerHTML = data
      .map(
        (app) => `
          <div class="app-card">
            <div class="app-imagen">
              <img src="${normalizeAssetPath(app.imagen)}" alt="${app.aplicacion}">
            </div>
            <div class="app-info">
              <div class="app-meta">${app.plataforma} | ${app.fecha}</div>
              <h3 class="app-titulo">${app.aplicacion}</h3>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error al cargar aplicaciones:", error);
  }
}

async function cargarStore() {
  const storeSection = document.querySelector(".my-nintendo-store-section");
  if (!storeSection) return;

  try {
    const data = await fetchStoreData();
    let storeGrid = storeSection.querySelector(".store-grid");
    if (!storeGrid) {
      storeGrid = document.createElement("div");
      storeGrid.className = "store-grid";
      storeSection.appendChild(storeGrid);
    }

    storeGrid.innerHTML = data
      .map(
        (item) => `
          <div class="store-card">
            <div class="store-imagen">
              <img src="${normalizeAssetPath(item.imagen)}" alt="${item.aplicacion}">
            </div>
            <div class="store-info">
              <div class="store-meta">${item.descripcion}</div>
              <h3 class="store-titulo">${item.aplicacion}</h3>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error al cargar My Nintendo Store:", error);
  }
}

export async function initStore() {
  await Promise.all([cargarAplicaciones(), cargarStore()]);
}

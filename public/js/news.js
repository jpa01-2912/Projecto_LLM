import { fetchNoticiasData, fetchNovedadesData, normalizeAssetPath } from "./api.js";

function renderPrincipal(principal = {}) {
  return `
    <div class="noticia-imagen">
      <img src="${normalizeAssetPath(principal.imagen)}" alt="${principal.titulo || ""}">
    </div>
    <div class="noticia-contenido">
      <span class="noticia-etiqueta">${principal.etiqueta || ""}</span>
      <h3>${principal.titulo || ""}</h3>
      <p>${principal.descripcion || ""}</p>
    </div>
  `;
}

function renderMiniNoticias(items = []) {
  return items
    .map(
      (noticia) => `
        <article class="mini-noticia">
          <div class="mini-noticia-img">
            <img src="${normalizeAssetPath(noticia.imagen)}" alt="${noticia.titulo || ""}">
          </div>
          <div class="mini-noticia-info">
            <span class="noticia-etiqueta">${noticia.etiqueta || ""}</span>
            <h4>${noticia.titulo || ""}</h4>
          </div>
        </article>
      `
    )
    .join("");
}

async function cargarNovedades() {
  const noticiaPrincipal = document.querySelector(".noticia-principal");
  const miniNoticiasGrid = document.querySelector(".mini-noticias-grid");
  if (!noticiaPrincipal || !miniNoticiasGrid) return;

  try {
    const data = await fetchNovedadesData();
    noticiaPrincipal.innerHTML = renderPrincipal(data.principal);
    noticiaPrincipal.style.display = "flex";
    miniNoticiasGrid.innerHTML = renderMiniNoticias(data.secundarias);
  } catch (error) {
    console.error("Error al cargar novedades:", error);
  }
}

async function cargarNoticiasGrid() {
  const container = document.getElementById("noticias-container");
  if (!container) return;

  try {
    const data = await fetchNoticiasData();
    const displayData = Array.isArray(data) ? data.slice(0, 8) : [];

    container.innerHTML = displayData
      .map(
        (noticia) => `
          <div class="noticia-card-simple" data-link="${noticia.link || "#"}">
            <div class="card-img">
              <img src="${normalizeAssetPath(noticia.imagen)}" alt="${noticia.titulo || ""}">
            </div>
            <div class="card-body">
              <div class="card-etiqueta">${noticia.etiqueta || ""}</div>
              <h3>${noticia.titulo || ""}</h3>
              <div class="card-meta">${noticia.fecha || ""}</div>
            </div>
          </div>
        `
      )
      .join("");

    container.querySelectorAll(".noticia-card-simple").forEach((card) => {
      card.addEventListener("click", () => {
        window.location.href = card.dataset.link || "#";
      });
    });
  } catch (error) {
    console.error("Error al cargar noticias:", error);
  }
}

function setupNovedadesTabs() {
  const tabs = document.querySelectorAll(".novedades-tabs .tab");
  const viewDestacadas = document.getElementById("view-destacadas");
  const viewNoticias = document.getElementById("view-noticias");

  if (!tabs.length || !viewDestacadas || !viewNoticias) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.target === "noticias") {
        viewDestacadas.classList.add("hidden");
        viewNoticias.classList.remove("hidden");
        await cargarNoticiasGrid();
        return;
      }

      viewDestacadas.classList.remove("hidden");
      viewNoticias.classList.add("hidden");
      await cargarNovedades();
    });
  });
}

export async function initNews() {
  setupNovedadesTabs();
  await cargarNovedades();
}

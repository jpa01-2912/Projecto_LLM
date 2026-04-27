import { fetchJuegosData, normalizeAssetPath } from "./api.js";

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function showToastHome(message, icon = "fa-check") {
  let toast = document.querySelector(".home-toast");
  if (toast) toast.remove();

  toast = document.createElement("div");
  toast.className = "home-toast";
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1a1a1a;
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    opacity: 0;
    transition: 0.3s;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: #e60012;"></i> ${message}`;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 10);

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    window.setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function toggleFavorito(button, juego) {
  const icon = button.querySelector("i");
  let wishlist = getWishlist();
  // Usar titulo (nuevo nombre) o juego (compatibilidad)
  const titulo = juego.titulo || juego.juego;
  const exists = wishlist.some((item) => (item.titulo || item.juego) === titulo);

  if (!exists) {
    icon?.classList.remove("fa-regular");
    icon?.classList.add("fa-solid");
    button.classList.add("activo");
    wishlist.push(juego);
    showToastHome(`${titulo} añadido a la lista de deseos`, "fa-heart");
  } else {
    icon?.classList.remove("fa-solid");
    icon?.classList.add("fa-regular");
    button.classList.remove("activo");
    wishlist = wishlist.filter((item) => (item.titulo || item.juego) !== titulo);
    showToastHome(`${titulo} eliminado de la lista`, "fa-heart-crack");
  }

  saveWishlist(wishlist);
}

function bindWishlistButtons(container) {
  container.querySelectorAll(".juego-favorito").forEach((button) => {
    button.addEventListener("click", () => {
      const gameData = JSON.parse(button.dataset.game);
      toggleFavorito(button, gameData);
    });
  });
}

function setupGameTabs() {
  const tabs = document.querySelectorAll(".juegos-tabs .tab");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
    });
  });
}

export async function initGames() {
  const juegosContainer = document.getElementById("juegos-container");
  if (!juegosContainer) return;

  try {
    const data = await fetchJuegosData();
    const wishlist = getWishlist();

    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const randomGames = shuffled.slice(0, 4);

    juegosContainer.innerHTML = randomGames
      .map((juego) => {
        // Compatibilidad con nombre antiguo (juego) y nuevo (titulo)
        const titulo = juego.titulo || juego.juego;
        const fecha  = juego.fecha  || juego.fecha_lanzamiento || "";
        const esNueva = juego.esNuevaConsola || juego.es_nueva_consola;
        const isInWishlist = wishlist.some(
          (item) => (item.titulo || item.juego) === titulo
        );

        return `
          <div class="juego-card">
            ${esNueva ? `
              <div class="badge-consola">
                <img src="./fotos/logos/nintendo-2.png" alt="Nueva Consola">
              </div>
            ` : ""}
            <div class="juego-imagen">
              <img src="${normalizeAssetPath(juego.imagen)}" alt="${titulo}">
            </div>
            <div class="juego-contenido">
              <div class="juego-fecha">${juego.plataforma || ""} | ${fecha}</div>
              <h3 class="juego-titulo">${titulo}</h3>
            </div>
            <div class="juego-favorito-container">
              <button class="juego-favorito ${isInWishlist ? "activo" : ""}" data-game='${JSON.stringify(juego).replace(/'/g, "&apos;")}'>
                <i class="${isInWishlist ? "fa-solid" : "fa-regular"} fa-heart"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    bindWishlistButtons(juegosContainer);
    setupGameTabs();
  } catch (error) {
    console.error("Error al cargar juegos:", error);
  }
}
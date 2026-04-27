// ============================= 
// CATÁLOGO DE JUEGOS - JavaScript
// Diseño consistente con index.html
// ============================= 

const container = document.getElementById("games-container");
const searchInput = document.getElementById("search");
const platformFilter = document.getElementById("platform-filter");
const sortSelect = document.getElementById("sort");
const resultsCount = document.getElementById("results-count");

let allGames = [];
let filteredGames = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("carrito")) || [];
let currentPage = 1;
const GAMES_PER_PAGE = 8;

// ========== CARGAR JUEGOS ==========
fetch("/api/juegos")
  .then(res => res.json())
  .then(games => {
    allGames = games;
    renderGames(games);
  })
  .catch(err => {
    console.error("Error cargando juegos:", err);
    container.innerHTML = `
      <div class="catalogo-empty">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>Error al cargar los juegos</p>
        <span>Verifica que el backend esté funcionando correctamente</span>
      </div>
    `;
  });

// ========== RENDERIZAR JUEGOS (con paginación) ==========
function renderGames(games) {
  filteredGames = games;
  currentPage = 1;
  renderPage();
}

function renderPage() {
  container.innerHTML = "";

  // Eliminar paginación anterior si existe
  const existingPagination = document.getElementById("pagination");
  if (existingPagination) existingPagination.remove();

  // Actualizar contador de resultados
  if (resultsCount) {
    if (filteredGames.length === 0) {
      resultsCount.textContent = "No se encontraron juegos";
    } else if (filteredGames.length === 1) {
      resultsCount.textContent = "1 juego encontrado";
    } else {
      resultsCount.textContent = `${filteredGames.length} juegos encontrados`;
    }
  }

  if (filteredGames.length === 0) {
    container.innerHTML = `
      <div class="catalogo-empty">
        <i class="fa-solid fa-gamepad"></i>
        <p>No se encontraron juegos</p>
        <span>Intenta cambiar los filtros de búsqueda</span>
      </div>
    `;
    return;
  }

  // Calcular juegos de la página actual
  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const start = (currentPage - 1) * GAMES_PER_PAGE;
  const pageGames = filteredGames.slice(start, start + GAMES_PER_PAGE);

  // Renderizar cards de la página actual
  pageGames.forEach(game => {
    const isInWishlist = wishlist.some(item => item.titulo === game.titulo);
    const precio = game.precio ? parseFloat(game.precio) : 0;

    const card = document.createElement("div");
    card.classList.add("catalogo-card");

    card.innerHTML = `
      ${game.es_nueva_consola ? `
        <div class="catalogo-badge">
          <img src="./fotos/logos/nintendo-2.png" alt="Nueva Consola">
        </div>
      ` : ""}
      <div class="catalogo-card-imagen">
        <img src="${game.imagen || "./fotos/placeholder.jpg"}" alt="${game.titulo}">
      </div>
      <div class="catalogo-card-contenido">
        <div class="catalogo-card-meta">${game.plataforma} | ${game.fecha_lanzamiento || game.fecha}</div>
        <h3 class="catalogo-card-titulo">${game.titulo}</h3>
        <div class="catalogo-card-precio">${precio.toFixed(2)}€</div>
      </div>
      <div class="catalogo-card-actions">
        <button class="catalogo-btn-cart">
          <i class="fa-solid fa-cart-shopping"></i> Añadir al carrito
        </button>
        <button class="catalogo-btn-wish ${isInWishlist ? "active" : ""}">
          <i class="${isInWishlist ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>
      </div>
    `;

    // Evento: Añadir al carrito
    card.querySelector(".catalogo-btn-cart").addEventListener("click", () => {
      addToCart(game);
    });

    // Evento: Toggle wishlist
    card.querySelector(".catalogo-btn-wish").addEventListener("click", () => {
      toggleWishlist(game);
    });

    container.appendChild(card);
  });

  // Renderizar paginación
  renderPagination(totalPages);
}

// ========== PAGINACIÓN ==========
function renderPagination(totalPages) {
  if (totalPages <= 1) return;

  const nav = document.createElement("div");
  nav.id = "pagination";

  // Botón anterior
  const btnPrev = document.createElement("button");
  btnPrev.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
  btnPrev.className = "pagination-btn";
  btnPrev.disabled = currentPage === 1;
  btnPrev.addEventListener("click", () => {
    currentPage--;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  nav.appendChild(btnPrev);

  // Números de página
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `pagination-btn${i === currentPage ? " active" : ""}`;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    nav.appendChild(btn);
  }

  // Botón siguiente
  const btnNext = document.createElement("button");
  btnNext.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  btnNext.className = "pagination-btn";
  btnNext.disabled = currentPage === totalPages;
  btnNext.addEventListener("click", () => {
    currentPage++;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  nav.appendChild(btnNext);

  container.insertAdjacentElement("afterend", nav);
}

// ========== WISHLIST ==========
function toggleWishlist(game) {
  const exists = wishlist.some(item => item.titulo === game.titulo);

  if (exists) {
    wishlist = wishlist.filter(item => item.titulo !== game.titulo);
    showToast(`${game.titulo} eliminado de la lista de deseos`, "fa-heart-crack");
  } else {
    wishlist.push(game);
    showToast(`${game.titulo} añadido a la lista de deseos`, "fa-heart");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  applyFilters();
}

// ========== CARRITO ==========
function addToCart(game) {
  const exists = cart.some(item => item.titulo === game.titulo);
  if (exists) {
    showToast("Este juego ya está en tu carrito", "fa-circle-info");
  } else {
    cart.push(game);
    localStorage.setItem("carrito", JSON.stringify(cart));
    showToast(`¡${game.titulo} añadido al carrito!`, "fa-cart-shopping");
  }
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, icon = "fa-check") {
  const existingToast = document.querySelector(".catalogo-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "catalogo-toast";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("visible");
  });

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ========== FILTROS ==========
function applyFilters() {
  let filtered = [...allGames];

  // Búsqueda por texto
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(game =>
      game.titulo.toLowerCase().includes(searchValue)
    );
  }

  // Filtro por plataforma
  if (platformFilter.value !== "all") {
    filtered = filtered.filter(game =>
      game.plataforma === platformFilter.value
    );
  }

  // Ordenar
  if (sortSelect.value === "price-asc") {
    filtered.sort((a, b) => (a.precio || 0) - (b.precio || 0));
  }

  if (sortSelect.value === "price-desc") {
    filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0));
  }

  if (sortSelect.value === "date-new") {
    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha.split("/").reverse().join("-"));
      const dateB = new Date(b.fecha.split("/").reverse().join("-"));
      return dateB - dateA;
    });
  }

  renderGames(filtered);
}

// ========== EVENTOS ==========
searchInput.addEventListener("input", applyFilters);
platformFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
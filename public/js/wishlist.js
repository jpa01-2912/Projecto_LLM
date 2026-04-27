// ============================= 
// LISTA DE DESEOS - JavaScript
// ============================= 

const container    = document.getElementById("wishlist-container");
const resultsCount = document.getElementById("results-count");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

renderWishlist();

function renderWishlist() {
  container.innerHTML = "";

  if (resultsCount) {
    if (wishlist.length === 0) {
      resultsCount.textContent = "No tienes juegos en tu lista de deseos";
    } else if (wishlist.length === 1) {
      resultsCount.textContent = "1 juego en tu lista";
    } else {
      resultsCount.textContent = `${wishlist.length} juegos en tu lista`;
    }
  }

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="catalogo-empty">
        <i class="fa-regular fa-heart"></i>
        <p>Tu lista de deseos está vacía</p>
        <span>Explora el <a href="juegos.html" style="color: #e60012; text-decoration: none; font-weight: 600;">catálogo de juegos</a> y añade tus favoritos</span>
      </div>
    `;
    return;
  }

  wishlist.forEach(game => {
    // Compatibilidad con nombre antiguo (juego) y nuevo (titulo)
    const titulo   = game.titulo   || game.juego || "Sin título";
    const fecha    = game.fecha    || game.fecha_lanzamiento || "";
    const esNueva  = game.esNuevaConsola || game.es_nueva_consola;
    const precio   = game.precio ? parseFloat(game.precio) : 0;

    const card = document.createElement("div");
    card.classList.add("catalogo-card");

    card.innerHTML = `
      ${esNueva ? `
        <div class="catalogo-badge">
          <img src="./fotos/logos/nintendo-2.png" alt="Nueva Consola">
        </div>
      ` : ""}
      <div class="catalogo-card-imagen">
        <img src="${game.imagen || "./fotos/placeholder.jpg"}" alt="${titulo}">
      </div>
      <div class="catalogo-card-contenido">
        <div class="catalogo-card-meta">${game.plataforma || ""} | ${fecha}</div>
        <h3 class="catalogo-card-titulo">${titulo}</h3>
        <div class="catalogo-card-precio">${precio.toFixed(2)}€</div>
      </div>
      <div class="catalogo-card-actions">
        <button class="catalogo-btn-cart">
          <i class="fa-solid fa-cart-shopping"></i> Añadir al carrito
        </button>
        <button class="catalogo-btn-wish catalogo-btn-remove" title="Eliminar de la lista">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    card.querySelector(".catalogo-btn-cart").addEventListener("click", () => {
      addToCartFromWishlist(game);
    });

    card.querySelector(".catalogo-btn-remove").addEventListener("click", () => {
      removeFromWishlist(titulo);
    });

    container.appendChild(card);
  });
}

function removeFromWishlist(titulo) {
  wishlist = wishlist.filter(game => (game.titulo || game.juego) !== titulo);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  showToast("Juego eliminado de la lista de deseos", "fa-heart-crack");
  renderWishlist();
}

function addToCartFromWishlist(game) {
  let cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const titulo = game.titulo || game.juego;
  const exists = cart.some(item => (item.titulo || item.juego) === titulo);

  if (exists) {
    showToast("Este juego ya está en tu carrito", "fa-circle-info");
  } else {
    cart.push(game);
    localStorage.setItem("carrito", JSON.stringify(cart));
    showToast(`¡${titulo} añadido al carrito!`, "fa-cart-shopping");
  }
}

function showToast(message, icon = "fa-check") {
  const existingToast = document.querySelector(".catalogo-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "catalogo-toast";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("visible"));

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
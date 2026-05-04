const container    = document.getElementById("wishlist-container");
const resultsCount = document.getElementById("results-count");
const loggedUser   = JSON.parse(localStorage.getItem("loggedUser")) || null;
let wishlist = [];

async function init() {
  if (loggedUser) {
    try {
      const res  = await fetch(`/api/favoritos?usuario_id=${loggedUser.id}`);
      wishlist   = await res.json();
    } catch (err) { console.error("Error cargando favoritos:", err); }
  } else {
    wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  }
  renderWishlist();
}

function renderWishlist() {
  container.innerHTML = "";

  if (resultsCount) {
    if (wishlist.length === 0)      resultsCount.textContent = "No tienes juegos en tu lista de deseos";
    else if (wishlist.length === 1) resultsCount.textContent = "1 juego en tu lista";
    else                            resultsCount.textContent = `${wishlist.length} juegos en tu lista`;
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

  wishlist.forEach(item => {
    const titulo  = item.titulo || item.juego || "Sin título";
    const fecha   = item.fecha  || item.fecha_lanzamiento || "";
    const esNueva = item.esNuevaConsola || item.es_nueva_consola;
    const precio  = item.precio ? parseFloat(item.precio) : 0;

    const card = document.createElement("div");
    card.classList.add("catalogo-card");
    card.innerHTML = `
      <div class="catalogo-badge">
        <img src="${esNueva ? "./fotos/logos/nintendo-2.png" : "./fotos/logos/nintendo-switch.png"}" alt="Consola">
      </div>
      <div class="catalogo-card-imagen">
        <img src="${item.imagen || "./fotos/placeholder.jpg"}" alt="${titulo}">
      </div>
      <div class="catalogo-card-contenido">
        <div class="catalogo-card-meta">${item.plataforma || ""} | ${fecha}</div>
        <h3 class="catalogo-card-titulo">${titulo}</h3>
        <div class="catalogo-card-precio">${precio.toFixed(2)}€</div>
      </div>
      <div class="catalogo-card-actions">
        <button class="catalogo-btn-cart"><i class="fa-solid fa-cart-shopping"></i> Añadir al carrito</button>
        <button class="catalogo-btn-wish catalogo-btn-remove" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    card.querySelector(".catalogo-btn-cart").addEventListener("click", () => addToCartFromWishlist(item));
    card.querySelector(".catalogo-btn-remove").addEventListener("click", () => removeFromWishlist(item));
    container.appendChild(card);
  });
}

async function removeFromWishlist(item) {
  const titulo = item.titulo || item.juego;
  if (loggedUser) {
    try {
      await fetch(`/api/favoritos/${item.id}`, { method: "DELETE" });
      wishlist = wishlist.filter(g => g.id !== item.id);
    } catch (err) { console.error(err); }
  } else {
    wishlist = wishlist.filter(g => (g.titulo || g.juego) !== titulo);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
  showToast("Juego eliminado de la lista de deseos", "fa-heart-crack");
  renderWishlist();
}

async function addToCartFromWishlist(item) {
  const titulo  = item.titulo || item.juego;
  const juegoId = item.juego_id || item.id;

  if (loggedUser) {
    try {
      const res  = await fetch("/api/carrito", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ usuario_id: loggedUser.id, juego_id: juegoId, cantidad: 1 }),
      });
      const data = await res.json();
      showToast(data.error ? "Este juego ya está en tu carrito" : `¡${titulo} añadido al carrito!`,
                data.error ? "fa-circle-info" : "fa-cart-shopping");
    } catch (err) { console.error(err); }
  } else {
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];
    if (cart.some(g => (g.titulo || g.juego) === titulo)) {
      showToast("Este juego ya está en tu carrito", "fa-circle-info");
    } else {
      cart.push(item);
      localStorage.setItem("carrito", JSON.stringify(cart));
      showToast(`¡${titulo} añadido al carrito!`, "fa-cart-shopping");
    }
  }
}

function showToast(message, icon = "fa-check") {
  const existing = document.querySelector(".catalogo-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "catalogo-toast";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => { toast.classList.remove("visible"); setTimeout(() => toast.remove(), 300); }, 2500);
}

init();
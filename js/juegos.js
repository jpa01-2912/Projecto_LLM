const container = document.getElementById("games-container");
const searchInput = document.getElementById("search");
const platformFilter = document.getElementById("platform-filter");
const sortSelect = document.getElementById("sort");
const wishlistCount = document.getElementById("wishlist-count");

let allGames = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

updateWishlistCount();

fetch("../data/juegos.json")
  .then(res => res.json())
  .then(games => {
    allGames = games;
    renderGames(games);
  });

function renderGames(games) {

  container.innerHTML = "";

  games.forEach(game => {

    const isInWishlist = wishlist.some(item => item.juego === game.juego);

    const card = document.createElement("div");
    card.classList.add("game-card");

    card.innerHTML = `
      <img src="${game.imagen}" alt="${game.juego}">
      <div class="game-info">
        <h3>${game.juego}</h3>
        <p><strong>Plataforma:</strong> ${game.plataforma}</p>
        <p><strong>Lanzamiento:</strong> ${game.fecha}</p>
        <div class="price">${game.precio.toFixed(2)}€</div>

        ${game.esNuevaConsola ? `<span class="badge">Nueva consola</span>` : ""}

        <div class="buttons">
          <button class="buy-btn">Comprar</button>
          <button class="wishlist-btn ${isInWishlist ? "active" : ""}">
            ${isInWishlist ? "❤️ Añadido" : "🤍 Añadir"}
          </button>
        </div>
      </div>
    `;

    // Comprar
    card.querySelector(".buy-btn").addEventListener("click", () => {
      alert("Has comprado " + game.juego);
    });

    // Wishlist toggle
    card.querySelector(".wishlist-btn").addEventListener("click", () => {
      toggleWishlist(game);
    });

    container.appendChild(card);
  });
}

function toggleWishlist(game) {

  const exists = wishlist.some(item => item.juego === game.juego);

  if (exists) {
    wishlist = wishlist.filter(item => item.juego !== game.juego);
  } else {
    wishlist.push(game);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  applyFilters();
}

function updateWishlistCount() {
  wishlistCount.textContent = wishlist.length;
}

function applyFilters() {

  let filtered = [...allGames];

  // Buscar
  const searchValue = searchInput.value.toLowerCase();
  filtered = filtered.filter(game =>
    game.juego.toLowerCase().includes(searchValue)
  );

  // Plataforma
  if (platformFilter.value !== "all") {
    filtered = filtered.filter(game =>
      game.plataforma === platformFilter.value
    );
  }

  // Ordenar
  if (sortSelect.value === "price-asc") {
    filtered.sort((a, b) => a.precio - b.precio);
  }

  if (sortSelect.value === "price-desc") {
    filtered.sort((a, b) => b.precio - a.precio);
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

// Eventos
searchInput.addEventListener("input", applyFilters);
platformFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
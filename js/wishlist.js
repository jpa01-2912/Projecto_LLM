const container = document.getElementById("wishlist-container");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

if (wishlist.length === 0) {
  container.innerHTML = "<p style='padding:40px'>No tienes juegos en tu lista 😢</p>";
} else {

  wishlist.forEach(game => {

    const card = document.createElement("div");
    card.classList.add("game-card");

    card.innerHTML = `
      <img src="${game.imagen}" alt="${game.juego}">
      <div class="game-info">
        <h3>${game.juego}</h3>
        <p><strong>Plataforma:</strong> ${game.plataforma}</p>
        <div class="price">${game.precio.toFixed(2)}€</div>
        <div class="buttons" style="display:flex; flex-direction:column; gap:8px;">
           <button class="buy-btn" style="background-color: #e60012; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">Añadir al carrito</button>
           <button class="wishlist-btn">Eliminar</button>
        </div>
      </div>
    `;

    // Boton eliminar
    card.querySelector(".wishlist-btn").addEventListener("click", () => {
      removeFromWishlist(game.juego);
    });

    // Boton Añadir a Carrito
    card.querySelector(".buy-btn").addEventListener("click", () => {
      addToCartFromWishlist(game);
    });

    container.appendChild(card);
  });
}

function removeFromWishlist(nombreJuego) {
  wishlist = wishlist.filter(game => game.juego !== nombreJuego);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  location.reload();
}

function addToCartFromWishlist(game) {
  let cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const exists = cart.some(item => item.juego === game.juego);
  
  if (exists) {
    alert("Este juego ya está en tu carrito.");
  } else {
    cart.push(game);
    localStorage.setItem("carrito", JSON.stringify(cart));
    alert(`¡${game.juego} añadido al carrito!`);
  }
}
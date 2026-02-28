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
        <button class="wishlist-btn">Eliminar</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      removeFromWishlist(game.juego);
    });

    container.appendChild(card);
  });
}

function removeFromWishlist(nombreJuego) {
  wishlist = wishlist.filter(game => game.juego !== nombreJuego);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  location.reload();
}
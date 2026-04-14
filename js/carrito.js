document.addEventListener('DOMContentLoaded', () => {
  const cartList = document.getElementById("cart-list");
  const subtotalElem = document.getElementById("subtotal-price");
  const taxesElem = document.getElementById("taxes-price");
  const totalElem = document.getElementById("total-price");
  const btnCheckout = document.getElementById("btn-checkout");
  
  let cart = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderCart() {
    cartList.innerHTML = "";
    
    if(cart.length === 0) {
      cartList.innerHTML = `
        <div class="empty-cart-msg">
          <h2>Tu carrito está vacío 😢</h2>
          <p>Parece que no has añadido ningún juego todavía.</p>
          <a href="juegos.html">Descubrir Juegos</a>
        </div>
      `;
      // Resetear resumen
      updateSummary(0);
      btnCheckout.disabled = true;
      btnCheckout.style.opacity = "0.5";
      btnCheckout.style.cursor = "not-allowed";
      return;
    }

    btnCheckout.disabled = false;
    btnCheckout.style.opacity = "1";
    btnCheckout.style.cursor = "pointer";

    let subtotal = 0;

    cart.forEach((game, index) => {
      subtotal += parseFloat(game.precio);

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${game.imagen}" alt="${game.juego}" onerror="this.src='./fotos/placeholder.jpg'">
        <div class="item-details">
          <h3>${game.juego}</h3>
          <span class="item-platform">${game.plataforma}</span>
        </div>
        <div class="item-actions">
          <div class="item-price">${parseFloat(game.precio).toFixed(2)}€</div>
          <button class="remove-btn" onclick="removeFromCart(${index})">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      `;
      cartList.appendChild(div);
    });

    updateSummary(subtotal);
  }

  function updateSummary(subtotal) {
    const taxRate = 0.21;
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes;

    subtotalElem.textContent = subtotal.toFixed(2) + "€";
    taxesElem.textContent = taxes.toFixed(2) + "€";
    totalElem.textContent = total.toFixed(2) + "€";
  }

  // Hacer la funcion global para el onclick inline
  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(cart));
    renderCart(); // Re-renderizar todo instantaneo
  };

  btnCheckout.addEventListener("click", () => {
    if(cart.length === 0) return;
    
    // Simular Compra
    btnCheckout.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
    
    setTimeout(() => {
      cart = [];
      localStorage.setItem("carrito", JSON.stringify(cart));
      renderCart();
      alert("¡Compra realizada con éxito! Gracias por confiar en Nintendo eShop.");
      btnCheckout.innerHTML = 'Continuar a la caja';
    }, 1500);
  });

  // Inicializar renderizado
  renderCart();
});

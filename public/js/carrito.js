// ============================= 
// CARRITO DE COMPRAS - JavaScript
// ============================= 

document.addEventListener('DOMContentLoaded', () => {
  const cartList      = document.getElementById("cart-list");
  const subtotalElem  = document.getElementById("subtotal-price");
  const taxesElem     = document.getElementById("taxes-price");
  const totalElem     = document.getElementById("total-price");
  const btnCheckout   = document.getElementById("btn-checkout");
  const countLabel    = document.getElementById("cart-count-label");

  let cart = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderCart() {
    cartList.innerHTML = "";

    if (countLabel) {
      if (cart.length === 0) {
        countLabel.textContent = "0 artículos";
      } else if (cart.length === 1) {
        countLabel.textContent = "1 artículo";
      } else {
        countLabel.textContent = `${cart.length} artículos`;
      }
    }

    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="empty-cart-msg">
          <i class="fa-solid fa-cart-shopping empty-icon"></i>
          <h2>Tu carrito está vacío</h2>
          <p>Parece que no has añadido ningún juego todavía.</p>
          <a href="juegos.html"><i class="fa-solid fa-gamepad"></i> Explorar juegos</a>
        </div>
      `;
      updateSummary(0);
      btnCheckout.disabled = true;
      return;
    }

    btnCheckout.disabled = false;

    let subtotal = 0;

    cart.forEach((game, index) => {
      // Compatibilidad con nombre antiguo (juego) y nuevo (titulo)
      const titulo  = game.titulo  || game.juego || "Sin título";
      const plataforma = game.plataforma || "";
      const precio  = parseFloat(game.precio) || 0;
      subtotal += precio;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${game.imagen || "./fotos/placeholder.jpg"}" alt="${titulo}" onerror="this.src='./fotos/placeholder.jpg'">
        <div class="item-details">
          <h3>${titulo}</h3>
          <span class="item-platform">${plataforma}</span>
        </div>
        <div class="item-actions">
          <div class="item-price">${precio.toFixed(2)}€</div>
          <button class="remove-btn" data-index="${index}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      `;

      div.querySelector(".remove-btn").addEventListener("click", () => {
        removeFromCart(index);
      });

      cartList.appendChild(div);
    });

    updateSummary(subtotal);
  }

  function updateSummary(subtotal) {
    const taxRate = 0.21;
    const taxes   = subtotal * taxRate;
    const total   = subtotal + taxes;
    subtotalElem.textContent = subtotal.toFixed(2) + "€";
    taxesElem.textContent    = taxes.toFixed(2)    + "€";
    totalElem.textContent    = total.toFixed(2)    + "€";
  }

  function removeFromCart(index) {
    const game = cart[index];
    const titulo = game?.titulo || game?.juego || "Juego";
    cart.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(cart));
    showToast(`${titulo} eliminado del carrito`, "fa-trash");
    renderCart();
  }

  btnCheckout.addEventListener("click", () => {
    if (cart.length === 0) return;

    const originalHTML = btnCheckout.innerHTML;
    btnCheckout.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
    btnCheckout.disabled = true;

    setTimeout(() => {
      cart = [];
      localStorage.setItem("carrito", JSON.stringify(cart));
      renderCart();
      showToast("¡Compra realizada con éxito! Gracias por confiar en Nintendo.", "fa-check-circle");
      btnCheckout.innerHTML = originalHTML;
    }, 1500);
  });

  function showToast(message, icon = "fa-check") {
    const existingToast = document.querySelector(".cart-toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("visible"));

    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  renderCart();
});
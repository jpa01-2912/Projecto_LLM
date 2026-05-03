// ============================= 
// CARRITO DE COMPRAS - JavaScript
// ============================= 

document.addEventListener('DOMContentLoaded', async () => {
  const cartList     = document.getElementById("cart-list");
  const subtotalElem = document.getElementById("subtotal-price");
  const taxesElem    = document.getElementById("taxes-price");
  const totalElem    = document.getElementById("total-price");
  const btnCheckout  = document.getElementById("btn-checkout");
  const countLabel   = document.getElementById("cart-count-label");

  // Selectores para Cupones
  const couponInput   = document.getElementById("coupon-code");
  const btnApply      = document.getElementById("btn-apply-coupon");
  const couponMsg     = document.getElementById("coupon-message");
  const discountRow   = document.getElementById("discount-row");
  const discountPrice = document.getElementById("discount-price");
  const discountLabel = document.getElementById("discount-label");

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser")) || null;
  let cart = [];
  let appliedCoupon = null;

  if (loggedUser) {
    try {
      const res = await fetch(`/api/carrito?usuario_id=${loggedUser.id}`);
      cart = await res.json();
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  } else {
    cart = JSON.parse(localStorage.getItem("carrito")) || [];
  }

  renderCart();
  // ========== CUPONES ==========
  btnApply.addEventListener("click", () => {
    const code = couponInput.value.trim().toLowerCase();
    
    if (!code) {
      appliedCoupon = null;
      couponMsg.className = "coupon-message";
      couponMsg.style.display = "none";
      renderCart();
      return;
    }

    if (code === "codigokonami") {
      appliedCoupon = "codigokonami";
      showCouponMessage("¡Código KONAMI aplicado! 50% de descuento en el total.", "success");
    } else if (code === "retro") {
      appliedCoupon = "retro";
      showCouponMessage("¡Código RETRO aplicado! 50% en juegos de Nintendo Switch 1.", "success");
    } else {
      appliedCoupon = null;
      showCouponMessage("Código no válido", "error");
    }

    renderCart();
  });

  function showCouponMessage(text, type) {
    couponMsg.textContent = text;
    couponMsg.className = `coupon-message ${type}`;
  }

  // ========== RENDERIZAR ==========
  function renderCart() {
    cartList.innerHTML = "";

    if (countLabel) {
      if (cart.length === 0)      countLabel.textContent = "0 artículos";
      else if (cart.length === 1) countLabel.textContent = "1 artículo";
      else                        countLabel.textContent = `${cart.length} artículos`;
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

    cart.forEach((item, index) => {
      const titulo     = item.titulo    || item.juego    || "Sin título";
      const plataforma = item.plataforma || "";
      const precio     = parseFloat(item.precio) || 0;
      const cantidad   = item.cantidad || 1;
      subtotal += precio * cantidad;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.imagen || "./fotos/placeholder.jpg"}" alt="${titulo}" onerror="this.src='./fotos/placeholder.jpg'">
        <div class="item-details">
          <h3>${titulo}</h3>
          <span class="item-platform">${plataforma}</span>
          ${cantidad > 1 ? `<span class="item-qty">x${cantidad}</span>` : ""}
        </div>
        <div class="item-actions">
          <div class="item-price">${(precio * cantidad).toFixed(2)}€</div>
          <button class="remove-btn" data-index="${index}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      `;

      div.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(index));
      cartList.appendChild(div);
    });

    updateSummary(subtotal);
  }

  // ========== ELIMINAR ITEM ==========
  async function removeFromCart(index) {
    const item   = cart[index];
    const titulo = item?.titulo || item?.juego || "Juego";

    if (loggedUser) {
      try {
        await fetch(`/api/carrito/${item.id}`, { method: "DELETE" });
      } catch (err) { console.error(err); }
    } else {
      const localCart = JSON.parse(localStorage.getItem("carrito")) || [];
      localCart.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(localCart));
    }

    cart.splice(index, 1);
    showToast(`${titulo} eliminado del carrito`, "fa-trash");
    renderCart();
  }

  // ========== RESUMEN ==========
  function updateSummary(subtotal) {
    let discount = 0;

    if (appliedCoupon === "codigokonami") {
      discount = subtotal * 0.5;
    } else if (appliedCoupon === "retro") {
      cart.forEach(item => {
        const esNueva = item.esNuevaConsola || item.es_nueva_consola;
        if (!esNueva || esNueva == 0) {
          discount += (parseFloat(item.precio) * (item.cantidad || 1)) * 0.5;
        }
      });
    }

    const taxRate = 0.21;
    const taxes   = (subtotal - discount) * taxRate;
    const total   = (subtotal - discount) + taxes;

    subtotalElem.textContent = subtotal.toFixed(2) + "€";
    taxesElem.textContent    = taxes.toFixed(2)    + "€";
    totalElem.textContent    = total.toFixed(2)    + "€";

    if (discount > 0) {
      discountRow.style.display = "flex";
      discountPrice.textContent = `-${discount.toFixed(2)}€`;
      discountLabel.textContent = `Descuento (${appliedCoupon === "codigokonami" ? "50%" : "Retro"})`;
    } else {
      discountRow.style.display = "none";
    }
  }

  // ========== FINALIZAR COMPRA ==========
  btnCheckout.addEventListener("click", async () => {
    if (cart.length === 0) return;

    const originalHTML    = btnCheckout.innerHTML;
    btnCheckout.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
    btnCheckout.disabled  = true;

    if (loggedUser) {
      try {
        await fetch(`/api/carrito?usuario_id=${loggedUser.id}`, { method: "DELETE" });
      } catch (err) { console.error(err); }
    } else {
      localStorage.removeItem("carrito");
    }

    setTimeout(() => {
      cart = [];
      renderCart();
      showToast("¡Compra realizada con éxito! Gracias por confiar en Nintendo.", "fa-check-circle");
      btnCheckout.innerHTML = originalHTML;
    }, 1500);
  });

  // ========== TOAST ==========
  function showToast(message, icon = "fa-check") {
    const existing = document.querySelector(".cart-toast");
    if (existing) existing.remove();

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
});
const form         = document.getElementById("login-form");
const errorMessage = document.getElementById("login-error");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email    = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res   = await fetch("/api/usuarios");
    const users = await res.json();
    const user  = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (user.estado && user.estado !== "activo") {
        errorMessage.textContent = "Error: Esta cuenta se encuentra deshabilitada o suspendida.";
        return;
      }

      localStorage.setItem("loggedUser", JSON.stringify(user));

      // Sincronizar carrito local → BD
      await syncLocalCarritoToBD(user.id);

      // Sincronizar wishlist local → BD
      await syncLocalWishlistToBD(user.id);

      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Correo o contraseña incorrectos. Por favor, revisa tus datos.";
    }
  } catch (err) {
    console.error(err);
    errorMessage.textContent = "Fallo de conexión crítico. Revisa que iniciaste tu backend.";
  }
});

async function syncLocalCarritoToBD(usuarioId) {
  const localCart = JSON.parse(localStorage.getItem("carrito")) || [];
  if (localCart.length === 0) return;

  for (const item of localCart) {
    if (!item.id) continue;
    try {
      await fetch("/api/carrito", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ usuario_id: usuarioId, juego_id: item.id, cantidad: item.cantidad || 1 }),
      });
    } catch (err) { console.warn("Error sincronizando carrito:", err); }
  }

  localStorage.removeItem("carrito");
}

async function syncLocalWishlistToBD(usuarioId) {
  const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (localWishlist.length === 0) return;

  for (const item of localWishlist) {
    if (!item.id) continue;
    try {
      await fetch("/api/favoritos", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ usuario_id: usuarioId, juego_id: item.id }),
      });
    } catch (err) { console.warn("Error sincronizando wishlist:", err); }
  }

  localStorage.removeItem("wishlist");
}
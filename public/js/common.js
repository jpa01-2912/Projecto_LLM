/**
 * common.js - Logica compartida entre todas las paginas del sitio.
 * Mantiene la UI de sesion en cliente, pero la autorizacion real debe vivir en el servidor.
 */

const ADMIN_ROLES = ["admin", "content_editor", "game_manager"];

document.addEventListener("DOMContentLoaded", () => {
  actualizarAuthAction();
});

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedUser") || "null");
  } catch (error) {
    console.error("No se pudo leer loggedUser desde localStorage:", error);
    return null;
  }
}

function hasClientAdminRole(user) {
  return Boolean(user && ADMIN_ROLES.includes(user.rol));
}

async function validateRoleWithServer(requiredRole) {
  // La UI puede apoyarse en localStorage para feedback rapido, pero las acciones
  // sensibles deben validarse con sesion real y rol efectivo en el backend.
  // Ejemplo futuro:
  // const response = await fetch(`/api/auth/validate-role?role=${requiredRole}`, { credentials: "include" });
  // return response.ok;
  return Boolean(requiredRole);
}

function actualizarAuthAction() {
  const authAction = document.getElementById("auth-action");
  if (!authAction) return;

  const user = getLoggedUser();

  if (user) {
    const topActions = authAction.parentElement;
    let adminLinkAction = document.getElementById("admin-link-action");

    if (hasClientAdminRole(user)) {
      if (!adminLinkAction && topActions) {
        adminLinkAction = document.createElement("div");
        adminLinkAction.className = "action";
        adminLinkAction.id = "admin-link-action";
        adminLinkAction.dataset.requiresServerRoleCheck = "true";
        adminLinkAction.innerHTML = `
          <i class="fa-solid fa-lock-open"></i>
          <a href="admin.html">Admin</a>
        `;
        topActions.insertBefore(adminLinkAction, authAction);
      }
    } else if (adminLinkAction) {
      adminLinkAction.remove();
    }

    if (user.avatar && user.avatar.trim() !== "") {
      authAction.innerHTML = `
        <img src="${user.avatar}" alt="Avatar" class="topbar-avatar">
        <a href="count.html">Mi cuenta</a>
      `;
    } else {
      authAction.innerHTML = `
        <i class="fa-solid fa-circle-user"></i>
        <a href="count.html">Mi cuenta</a>
      `;
    }
  } else {
    mostrarLoginLink(authAction);
    const adminLinkAction = document.getElementById("admin-link-action");
    if (adminLinkAction) adminLinkAction.remove();
  }
}

function mostrarLoginLink(container) {
  container.innerHTML = `
    <i class="fa-solid fa-user"></i>
    <a href="login.html">Iniciar sesion</a>
  `;
}

window.authUI = {
  getLoggedUser,
  hasClientAdminRole,
  validateRoleWithServer,
  actualizarAuthAction,
};

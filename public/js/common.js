/**
 * common.js - Lógica compartida entre todas las páginas del sitio
 * Maneja la autenticación en el topbar y el control de acceso administrativo.
 */

document.addEventListener("DOMContentLoaded", () => {
    actualizarAuthAction();
});

function actualizarAuthAction() {
    const authAction = document.getElementById("auth-action");
    if (!authAction) return;

    const loggedUserString = localStorage.getItem("loggedUser");

    if (loggedUserString) {
        try {
            const user = JSON.parse(loggedUserString);
            const adminRoles = ["admin", "content_editor", "game_manager"];

            // Gestión del link de Admin
            const topActions = authAction.parentElement;
            let adminLinkAction = document.getElementById("admin-link-action");

            if (adminRoles.includes(user.rol)) {
                // Si es un rol administrativo, mostrar el link si no existe ya
                if (!adminLinkAction) {
                    adminLinkAction = document.createElement("div");
                    adminLinkAction.className = "action";
                    adminLinkAction.id = "admin-link-action";
                    adminLinkAction.innerHTML = `
                        <i class="fa-solid fa-lock-open"></i>
                        <a href="admin.html">Admin</a>
                    `;
                    // Insertar antes del botón de Mi cuenta
                    topActions.insertBefore(adminLinkAction, authAction);
                }
            } else {
                // Si no es admin pero el link existe (ej. cambió de sesión), eliminarlo
                if (adminLinkAction) adminLinkAction.remove();
            }

            // Gestión de la foto de perfil o icono
            if (user.avatar && user.avatar.trim() !== '') {
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
        } catch (e) {
            console.error("Error al procesar el usuario logueado:", e);
            mostrarLoginLink(authAction);
        }
    } else {
        // No hay usuario logueado
        mostrarLoginLink(authAction);
        // Asegurarse de quitar el link de admin
        const adminLinkAction = document.getElementById("admin-link-action");
        if (adminLinkAction) adminLinkAction.remove();
    }
}

function mostrarLoginLink(container) {
    container.innerHTML = `
        <i class="fa-solid fa-user"></i>
        <a href="login.html">Iniciar sesión</a>
    `;
}

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedUser") || "null");
  } catch (error) {
    console.error("No se pudo procesar la sesion local:", error);
    return null;
  }
}

export function enhanceLoggedUserGreeting() {
  const loggedUser = getLoggedUser();
  if (!loggedUser) return;

  const loginLink = document.querySelector(".top-actions .action a[href='login.html']");
  if (!loginLink || !loggedUser.email) return;

  const baseName = loggedUser.email.split("@")[0] || "Usuario";
  const displayName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  loginLink.textContent = `Hola, ${displayName}`;

  const loginContainer = loginLink.parentElement;
  if (!loginContainer || loginContainer.querySelector(".logout-link")) return;

  const logoutBtn = document.createElement("a");
  logoutBtn.href = "#";
  logoutBtn.textContent = "(Salir)";
  logoutBtn.className = "logout-link";
  logoutBtn.style.color = "#ccc";
  logoutBtn.style.fontSize = "12px";
  logoutBtn.style.marginLeft = "8px";

  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("loggedUser");
    window.location.reload();
  });

  loginContainer.appendChild(logoutBtn);
}

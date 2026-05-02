// ===========================
// REGISTRO - Con validación por Expresiones Regulares
// ===========================

const registerForm = document.getElementById("register-form");
const error = document.getElementById("register-error");
const passwordInput = document.getElementById("password");

// ============================================================
// EXPRESIONES REGULARES DE VALIDACIÓN
// ============================================================
const passwordRules = {
  len:     { re: /.{8,}/,          label: "r-len",     text: "Mínimo 8 caracteres" },
  upper:   { re: /[A-Z]/,          label: "r-upper",   text: "Una mayúscula" },
  lower:   { re: /[a-z]/,          label: "r-lower",   text: "Una minúscula" },
  num:     { re: /[0-9]/,          label: "r-num",     text: "Un número" },
  nospace: { re: /^\S+$/,          label: "r-nospace", text: "Sin espacios" },
};

// Función principal de validación — devuelve true si cumple TODAS las reglas
function validarPassword(pwd) {
  return Object.values(passwordRules).every(rule => rule.re.test(pwd));
}

// ============================================================
// INDICADOR VISUAL EN TIEMPO REAL
// ============================================================
passwordInput?.addEventListener("input", () => {
  const val = passwordInput.value;
  let passed = 0;

  Object.values(passwordRules).forEach(rule => {
    const li = document.getElementById(rule.label);
    if (!li) return;
    const ok = val.length > 0 && rule.re.test(val);
    li.className = val.length === 0 ? "pwd-rule" : ok ? "pwd-rule ok" : "pwd-rule fail";
    if (ok) passed++;
  });

  // Barra de fortaleza
  const fill = document.getElementById("pwd-strength-fill");
  const label = document.getElementById("pwd-strength-label");
  if (!fill || !label) return;

  const pct = val.length === 0 ? 0 : Math.round((passed / Object.keys(passwordRules).length) * 100);
  fill.style.width = pct + "%";

  if (pct === 0)      { fill.style.background = "transparent"; label.textContent = ""; }
  else if (pct <= 40) { fill.style.background = "#e60012"; label.textContent = "Débil"; label.style.color = "#e60012"; }
  else if (pct <= 70) { fill.style.background = "#f59e0b"; label.textContent = "Moderada"; label.style.color = "#f59e0b"; }
  else if (pct < 100) { fill.style.background = "#3b82f6"; label.textContent = "Buena"; label.style.color = "#3b82f6"; }
  else                { fill.style.background = "#16a34a"; label.textContent = "Fuerte ✓"; label.style.color = "#16a34a"; }
});

// Toggle mostrar/ocultar contraseña
document.getElementById("toggle-password")?.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  const icon = document.getElementById("toggle-password");
  icon.textContent = type === "password" ? "👁" : "🙈";
});

// ============================================================
// SUBMIT DEL FORMULARIO
// ============================================================
registerForm.addEventListener("submit", async function(e) {
  e.preventDefault();

  const email    = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  // Validar email con ER
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    error.textContent = "El formato del email no es válido.";
    return;
  }

  // Validar contraseña con ER
  if (!validarPassword(password)) {
    error.textContent = "La contraseña no cumple todos los requisitos.";
    return;
  }

  try {
    // Comprobar si el email ya está registrado
    const res   = await fetch("/api/usuarios");
    const users = await res.json();

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      error.textContent = "Este correo ya está registrado en la base de datos.";
      return;
    }

    // Generar nombre a partir del email
    const baseName    = email.split("@")[0];
    const displayName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

    const newUser = {
      nombre:          displayName,
      email:           email,
      password:        password,
      rol:             "user",
      estado:          "activo",
      fecha_registro:  new Date().toISOString().split("T")[0],
      avatar:          `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.charAt(0))}&background=E60012&color=fff`,
    };

    await fetch("/api/usuarios", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(newUser),
    });

    alert("¡Cuenta creada correctamente!");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    error.textContent = "Error de conexión con el servidor. Revisa tu backend.";
  }
});
const form = document.getElementById("login-form");
const errorMessage = document.getElementById("login-error");

form.addEventListener("submit", async function(e){

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
  // Cargar cuentas reales del Backend
  const res = await fetch("/api/usuarios");
  const users = await res.json();
  
  // Condición estricta: email exacto y contraseña combinan
  const user = users.find(u =>
    u.email === email && u.password === password
  );

  if(user){
    if (user.estado && user.estado !== "activo") {
       errorMessage.textContent = "Error: Esta cuenta se encuentra deshabilitada o suspendida.";
       return;
    }
    
    // Inició sesión exitosamente (Guardar token local para frontend flow)
    localStorage.setItem("loggedUser", JSON.stringify(user));
    window.location.href = "index.html";
  }else{
    errorMessage.textContent = "Correo o contraseña incorrectos. Por favor, revisa tus datos.";
  }
} catch (err) {
  console.error(err);
  errorMessage.textContent = "Fallo de conexión crítico. Revisa que iniciaste tu backend.";
}

});
const registerForm = document.getElementById("register-form");
const error = document.getElementById("register-error");

registerForm.addEventListener("submit", async function(e){

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
  // Pedir lista actual para checkear duplicados
  const res = await fetch("/api/usuarios");
  const users = await res.json();
  
  const existingUser = users.find(u => u.email === email);

  if(existingUser){
    error.textContent = "Este correo ya está registrado en la base de datos";
    return;
  }

  // Generar nombre chulo para la BD a partir del email
  let baseName = email.split("@")[0];
  let displayName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  const newUser = {
    id: Date.now(), // ID dinámico
    nombre: displayName,
    email: email,
    password: password, // Guardamos contraseña permanentemente en la DB Backend
    rol: "user",
    estado: "activo",
    fecha_registro: new Date().toISOString().split('T')[0],
    avatar: `https://ui-avatars.com/api/?name=${displayName.charAt(0)}&background=random&color=fff`
  };

  // Enviar a la base JSON principal usando la API del servidor local
  await fetch("/api/usuarios", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  });

  alert("¡Cuenta creada y almacenada en la base de datos correctamente!");
  window.location.href = "login.html";

} catch (err) {
  console.error(err);
  error.textContent = "Error de conexión con el servidor. Revisa tu backend.";
}

});
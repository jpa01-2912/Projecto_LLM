const form = document.getElementById("login-form");
const errorMessage = document.getElementById("login-error");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("../users.json")
    .then(response => response.json())
    .then(users => {

      const user = users.find(u => 
        u.email === email && u.password === password
      );

      if(user) {
        alert("¡Inicio de sesión exitoso!");
        window.location.href = "index.html"; // vuelve al inicio
      } else {
        errorMessage.textContent = "Correo o contraseña incorrectos";
      }

    })
    .catch(error => {
      errorMessage.textContent = "Error al conectar con el servidor";
      console.error(error);
    });
});
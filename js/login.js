const form = document.getElementById("login-form");
const errorMessage = document.getElementById("login-error");

form.addEventListener("submit", function(e){

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const users = JSON.parse(localStorage.getItem("users")) || [];

const user = users.find(u =>
u.email === email && u.password === password
);

if(user){

localStorage.setItem("loggedUser", JSON.stringify(user));

window.location.href = "index.html";

}else{

errorMessage.textContent = "Correo o contraseña incorrectos";

}

});
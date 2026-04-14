const registerForm = document.getElementById("register-form");
const error = document.getElementById("register-error");

registerForm.addEventListener("submit", function(e){

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

let users = JSON.parse(localStorage.getItem("users")) || [];

const existingUser = users.find(u => u.email === email);

if(existingUser){

error.textContent = "Este correo ya está registrado";
return;

}

const newUser = {
email: email,
password: password
};

users.push(newUser);

localStorage.setItem("users", JSON.stringify(users));

alert("Cuenta creada correctamente");

window.location.href = "login.html";

});
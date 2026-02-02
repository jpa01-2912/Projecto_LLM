let indiceActual = 0;
let imagenes = []; 

const imagenSlide = document.getElementById("carousel-img");
const indicadoresContainer = document.getElementById("indicators-container");


fetch('./json/datos.json')
  .then(response => response.json())
  .then(data => {
    imagenes = data;
    inicializarCarrusel();
  })
  .catch(error => console.error("Error cargando el JSON:", error));

function inicializarCarrusel() {
  imagenes.forEach((_, i) => {
    const bar = document.createElement("span");
    bar.classList.add("bar");
    if (i === 0) bar.classList.add("active");
    indicadoresContainer.appendChild(bar);
  });

  actualizarCarrusel();
}

function actualizarCarrusel() {
    const bars = document.querySelectorAll(".bar");
    const slideContainer = document.querySelector(".slide"); // El contenedor donde van las fotos

    // Calculamos los índices de la imagen anterior y siguiente
    const indiceAnterior = (indiceActual - 1 + imagenes.length) % imagenes.length;
    const indiceSiguiente = (indiceActual + 1) % imagenes.length;

    // Limpiamos el contenedor y creamos las 3 imágenes
    slideContainer.innerHTML = `
        <img src="${imagenes[indiceAnterior].url}" class="img-side" alt="anterior">
        <img src="${imagenes[indiceActual].url}" id="carousel-img" class="img-main" alt="${imagenes[indiceActual].alt}">
        <img src="${imagenes[indiceSiguiente].url}" class="img-side" alt="siguiente">
    `;

    // Actualizamos las barritas
    bars.forEach((bar, i) => {
        bar.classList.toggle("active", i === indiceActual);
    });
}

// Eventos de las flechas (igual que antes)
document.querySelector(".arrow.right").addEventListener("click", () => {
  indiceActual = (indiceActual + 1) % imagenes.length;
  actualizarCarrusel();
});

document.querySelector(".arrow.left").addEventListener("click", () => {
  indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
  actualizarCarrusel();
});
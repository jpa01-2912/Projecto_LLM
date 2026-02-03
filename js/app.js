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
    const slideContainer = document.querySelector(".slide");

    const indiceAnterior = (indiceActual - 1 + imagenes.length) % imagenes.length;
    const indiceSiguiente = (indiceActual + 1) % imagenes.length;
    const itemActual = imagenes[indiceActual]; // Referencia al objeto actual del JSON

    // Añadimos el contenedor 'caption' solo a la imagen principal
    let botonHTML = '';
    if (itemActual.boton_texto && itemActual.link) {
        botonHTML = `<a href="${itemActual.link}" class="caption-button">${itemActual.boton_texto}</a>`;
    }
    slideContainer.innerHTML = `
        <img src="${imagenes[indiceAnterior].url}" class="img-side" alt="anterior">
        
        <div class="main-wrapper"> 
            <img src="${itemActual.url}" id="carousel-img" class="img-main" alt="${itemActual.alt}">
            
            <div class="carousel-caption">
                <h2 class="caption-text">${itemActual.titulo || ''}</h2>
                ${botonHTML}
            </div>
        </div>

        <img src="${imagenes[indiceSiguiente].url}" class="img-side" alt="siguiente">
    `;

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
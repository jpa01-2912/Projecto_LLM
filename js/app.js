let indiceActual = 0;
let imagenes = [];
let intervaloAutoplay;

const imagenSlide = document.getElementById("carousel-img");
const indicadoresContainer = document.getElementById("indicators-container");

fetch("./data/noticias.json")
  .then((response) => response.json())
  .then((data) => {
    imagenes = data;
    inicializarCarrusel();
    iniciarAutoplay();
  })
  .catch((error) => console.error("Error cargando el JSON:", error));

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
  const itemActual = imagenes[indiceActual];

  // Normalizar rutas de imagenes
  let urlAnterior = imagenes[indiceAnterior].url;
  let urlActual = itemActual.url;
  let urlSiguiente = imagenes[indiceSiguiente].url;

  // Asegurar rutas correctas
  if (urlAnterior.includes("/projecto_llm/")) {
    urlAnterior = urlAnterior.replace("/projecto_llm/", "./");
  }

  let botonHTML = "";
  if (itemActual.boton_texto && itemActual.link) {
    botonHTML = `<a href="${itemActual.link}" class="caption-button">${itemActual.boton_texto}</a>`;
  }

  slideContainer.innerHTML = `
        <img src="${urlAnterior}" class="img-side" alt="anterior">
        
        <div class="main-wrapper"> 
            <img src="${urlActual}" id="carousel-img" class="img-main" alt="${itemActual.alt}">
            
            <div class="carousel-caption">
                <h2 class="caption-text">${itemActual.titulo || ""}</h2>
                ${botonHTML}
            </div>
        </div>

        <img src="${urlSiguiente}" class="img-side" alt="siguiente">
    `;

  bars.forEach((bar, i) => {
    bar.classList.toggle("active", i === indiceActual);
  });
}

// ========== FUNCIONES PARA EL AUTOPLAY ==========
function iniciarAutoplay() {
  // Limpiar intervalo existente si lo hay
  if (intervaloAutoplay) {
    clearInterval(intervaloAutoplay);
  }
  // Crear nuevo intervalo cada 3 segundos
  intervaloAutoplay = setInterval(() => {
    indiceActual = (indiceActual + 1) % imagenes.length;
    actualizarCarrusel();
  }, 5000); // 5000ms = 5 segundos
}

function detenerAutoplay() {
  if (intervaloAutoplay) {
    clearInterval(intervaloAutoplay);
    intervaloAutoplay = null;
  }
}



// Eventos de las flechas (igual que antes)
document.querySelector(".arrow.right").addEventListener("click", () => {
  detenerAutoplay();
  indiceActual = (indiceActual + 1) % imagenes.length;
  actualizarCarrusel();
  iniciarAutoplay();
});

document.querySelector(".arrow.left").addEventListener("click", () => {
  detenerAutoplay();
  indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
  actualizarCarrusel();
  iniciarAutoplay();
});

document.querySelector(".carousel")?.addEventListener("mouseenter", () => {
  detenerAutoplay();
});

document.querySelector(".carousel")?.addEventListener("mouseleave", () => {
  iniciarAutoplay();
});

// ========== CARGAR NOTICIAS DESDE JSON ==========
document.addEventListener("DOMContentLoaded", function () {
  cargarNoticias();
});

function cargarNoticias() {
  // Cargar las noticias desde el JSON
  fetch("./data/noticias-web.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el JSON");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Noticias cargadas:", data); // Para verificar que carga

      // Cargar noticia principal
      const noticiaPrincipal = document.querySelector(".noticia-principal");
      if (noticiaPrincipal) {
        noticiaPrincipal.innerHTML = `
          <div class="noticia-imagen">
            <img src="${data.principal.imagen}" alt="${data.principal.titulo}">
          </div>
          <div class="noticia-contenido">
            <span class="noticia-etiqueta">${data.principal.etiqueta}</span>
            <h3>${data.principal.titulo}</h3>
            <p>${data.principal.descripcion}</p>
            <span class="noticia-fuente">${data.principal.fuente}</span>
          </div>
        `;
      }

      // Cargar mini noticias
      const miniNoticiasGrid = document.querySelector(".mini-noticias-grid");
      if (miniNoticiasGrid) {
        miniNoticiasGrid.innerHTML = data.secundarias
          .map(
            (noticia) => `
          <article class="mini-noticia">
            <div class="mini-noticia-img">
              <img src="${noticia.imagen}" alt="${noticia.titulo}">
            </div>
            <div class="mini-noticia-info">
              <span class="noticia-etiqueta">${noticia.etiqueta}</span>
              <h4>${noticia.titulo}</h4>
            </div>
          </article>
        `,
          )
          .join("");
      }

      // Configurar tabs
      configurarTabs(data);
    })
    .catch((error) => {
      console.error("Error al cargar noticias:", error);
      // Mostrar mensaje de error en el HTML
      const noticiaPrincipal = document.querySelector(".noticia-principal");
      if (noticiaPrincipal) {
        noticiaPrincipal.innerHTML = `
          <div class="noticia-contenido">
            <h3>Error al cargar las noticias</h3>
            <p>No se pudieron cargar las noticias. Intenta recargar la página.</p>
          </div>
        `;
      }
    });
}

function configurarTabs(data) {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      // Cambiar pestaña activa
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const noticiaPrincipal = document.querySelector(".noticia-principal");
      const miniNoticiasGrid = document.querySelector(".mini-noticias-grid");

      if (index === 0) {
        // Pestaña DESTACADAS
        if (noticiaPrincipal) {
          noticiaPrincipal.style.display = "flex";
          noticiaPrincipal.innerHTML = `
            <div class="noticia-imagen">
              <img src="${data.principal.imagen}" alt="${data.principal.titulo}">
            </div>
            <div class="noticia-contenido">
              <span class="noticia-etiqueta">${data.principal.etiqueta}</span>
              <h3>${data.principal.titulo}</h3>
              <p>${data.principal.descripcion}</p>
              <span class="noticia-fuente">${data.principal.fuente}</span>
            </div>
          `;
        }

        if (miniNoticiasGrid) {
          miniNoticiasGrid.innerHTML = data.secundarias
            .map(
              (noticia) => `
            <article class="mini-noticia">
              <div class="mini-noticia-img">
                <img src="${noticia.imagen}" alt="${noticia.titulo}">
              </div>
              <div class="mini-noticia-info">
                <span class="noticia-etiqueta">${noticia.etiqueta}</span>
                <h4>${noticia.titulo}</h4>
              </div>
            </article>
          `,
            )
            .join("");
        }
      } else {
        // Pestaña NOTICIAS
        if (noticiaPrincipal) {
          noticiaPrincipal.style.display = "none";
        }

        if (miniNoticiasGrid && data.otrasNoticias) {
          miniNoticiasGrid.innerHTML = data.otrasNoticias
            .map(
              (noticia) => `
            <article class="mini-noticia">
              <div class="mini-noticia-img">
                <img src="${noticia.imagen}" alt="${noticia.titulo}">
              </div>
              <div class="mini-noticia-info">
                <span class="noticia-etiqueta">${noticia.etiqueta}</span>
                <h4>${noticia.titulo}</h4>
              </div>
            </article>
          `,
            )
            .join("");
        }
      }
    });
  });
}


let indiceActual = 0;
let imagenes = [];
let intervaloAutoplay;
let progresoIntervalo;
let tiempoRestante = 3000;
let ultimoTiempo;
let estadoAnimacion = "cargado";
let cicloCompleto = false;

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
  indicadoresContainer.innerHTML = "";

  imagenes.forEach((_, i) => {
    const bar = document.createElement("span");
    bar.classList.add("bar");
    if (i === 0) bar.classList.add("active");

    bar.addEventListener("click", () => {
      detenerAutoplay();
      indiceActual = i;
      actualizarCarrusel();
      //iniciarAutoplay();

      setTimeout(() => {
        const activeBar = document.querySelector(".bar.active");
        if (activeBar) {
          activeBar.classList.remove("cargando", "descargando");
          void activeBar.offsetWidth;
          activeBar.classList.add("cargando");
          activeBar.style.animationPlayState = "running";
        }
        iniciarAutoplay();
      }, 100);
    });
    indicadoresContainer.appendChild(bar);
  });

  actualizarCarrusel();
}

function actualizarCarrusel() {
  const bars = document.querySelectorAll(".bar");
  const slideContainer = document.querySelector(".slide");
  //const carousel = document.querySelector(".carousel");

  const indiceAnterior = (indiceActual - 1 + imagenes.length) % imagenes.length;
  const indiceSiguiente = (indiceActual + 1) % imagenes.length;
  const itemActual = imagenes[indiceActual];

  //slideContainer.style.opacity = "0.7";

  setTimeout(() => {
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

    // PRIMERO: Quitar todas las animaciones
    const allImages = slideContainer.querySelectorAll("img");
    allImages.forEach((img) => {
      img.style.animation = "none";
    });

    // SEGUNDO: Actualizar el contenido
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

    // TERCERO: Forzar reflow para reiniciar animaciones
    void slideContainer.offsetWidth;

    // CUARTO: Aplicar las animaciones manualmente
    const imgMain = slideContainer.querySelector(".img-main");
    const imgSideFirst = slideContainer.querySelector(".img-side:first-child");
    const imgSideLast = slideContainer.querySelector(".img-side:last-child");
    const caption = slideContainer.querySelector(".carousel-caption");

    if (imgMain) {
      imgMain.style.animation =
        "slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
    }
    if (imgSideFirst) {
      imgSideFirst.style.animation =
        "slideOutToLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
    }
    if (imgSideLast) {
      imgSideLast.style.animation =
        "slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards";
    }
    if (caption) {
      caption.style.animation = "fadeInUp 0.6s ease-out 0.3s both";
    }

    bars.forEach((bar, i) => {
      bar.classList.toggle("active", i === indiceActual);
    });

    const activeBar = document.querySelector(".bar.active");
    if (activeBar) {
      activeBar.style.animation = "";
      activeBar.classList.remove("cargando", "descargando");
      void activeBar.offsetWidth;

      estadoAnimacion = "cargando";
      activeBar.classList.add("cargando");
      activeBar.style.animationPlayState = "running";
    }
  }, 50);
}

// ========== FUNCIONES PARA EL AUTOPLAY ==========
function iniciarAutoplay() {
  // Limpiar intervalo existente si lo hay
  if (intervaloAutoplay) {
    clearInterval(intervaloAutoplay);
  }

  // Iniciar con animación de carga
  estadoAnimacion = "cargando";
  aplicarAnimacionBarra("cargando");

  // Ciclo completo: carga (1.5s) + descarga (1.5s) = 3s total
  intervaloAutoplay = setInterval(() => {
    if (estadoAnimacion === "cargando") {
      // Cambiar a descarga
      estadoAnimacion = "descargando";
      aplicarAnimacionBarra("descargando");
    } else {
      // Cambiar imagen y reiniciar ciclo
      indiceActual = (indiceActual + 1) % imagenes.length;
      actualizarCarrusel();

      // Volver a carga después de actualizar
      setTimeout(() => {
        estadoAnimacion = "cargando";
        aplicarAnimacionBarra("cargando");
      }, 100);
    }
  }, 1500);
}

function aplicarAnimacionBarra(tipo) {
  const activeBar = document.querySelector(".bar.active");
  if (!activeBar) return;

  // Quitar cualquier animación directa
  activeBar.style.animation = "";
  // Quitar clases anteriores
  activeBar.classList.remove("cargando", "descargando");

  // Forzar reflow
  void activeBar.offsetWidth;

  // Añadir nueva clase
  activeBar.classList.add(tipo);
  activeBar.style.animationPlayState = "running";
}

// Asegurar que la barra activa tiene la animación corriendo
/*const activeBar = document.querySelector(".bar.active");
  if (activeBar) {
    activeBar.style.animation = "none";
    activeBar.offsetHeight;
    activeBar.style.animation = "progress 3s linear forwards";
    activeBar.style.animationPlayState = "running";
  }

  // Crear nuevo intervalo cada 3 segundos
  intervaloAutoplay = setInterval(() => {
    indiceActual = (indiceActual + 1) % imagenes.length;
    actualizarCarrusel();
  }, 3000); // 3000ms = 3 segundos*/

function detenerAutoplay() {
  if (intervaloAutoplay) {
    clearInterval(intervaloAutoplay);
    intervaloAutoplay = null;
  }

  // Pausar la animación de la barra activa
  const activeBar = document.querySelector(".bar.active");
  if (activeBar) {
    activeBar.style.animationPlayState = "paused";
  }
}

// Eventos de las flechas (igual que antes)
document.querySelector(".arrow.right").addEventListener("click", () => {
  detenerAutoplay();
  indiceActual = (indiceActual + 1) % imagenes.length;
  actualizarCarrusel();
  //iniciarAutoplay();

  setTimeout(() => {
    estadoAnimacion = "cargando";
    iniciarAutoplay();
  }, 100);
});

document.querySelector(".arrow.left").addEventListener("click", () => {
  detenerAutoplay();
  indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
  actualizarCarrusel();

  setTimeout(() => {
    estadoAnimacion = "cargando";
    iniciarAutoplay();
  }, 100);
});

document.querySelector(".carousel")?.addEventListener("mouseenter", () => {
  detenerAutoplay();

  const activeBar = document.querySelector(".bar.active");
  if (activeBar) {
    activeBar.style.animationPlayState = "paused";
  }
});

document.querySelector(".carousel")?.addEventListener("mouseleave", () => {
  iniciarAutoplay();

  //const activeBar = document.querySelector(".bar.active");
  //if (activeBar) {
  //  activeBar.style.animationPlayState = "running";
  //}
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

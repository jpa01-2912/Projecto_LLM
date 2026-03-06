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

fetch("./data/carrousel.json")
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
    if (urlActual.includes("/projecto_llm/")) {
      urlActual = urlActual.replace("/projecto_llm/", "./");
    }
    if (urlSiguiente.includes("/projecto_llm/")) {
      urlSiguiente = urlSiguiente.replace("/projecto_llm/", "./");
    }

    let botonHTML = "";
    if (itemActual.boton_texto && itemActual.link) {
      botonHTML = `<a href="${itemActual.link}" class="caption-button">${itemActual.boton_texto}</a>`;
    }

    // PRIMERO: Quitar todas las animaciones
    const allImages = slideContainer.querySelectorAll("img");
    allImages.forEach((img) => {
      img.style.animation = "none";
      img.style.transform = "";
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
    const imgSideFirst = slideContainer.querySelector(".img-side:first-child"); // IZQUIERDA
    const imgSideLast = slideContainer.querySelector(".img-side:last-child"); // DERECHA
    const caption = slideContainer.querySelector(".carousel-caption");

    if (imgMain) {
      imgMain.style.animation =
        "slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
    }
    if (imgSideFirst) {
      imgSideFirst.style.animation =
        "slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
    }
    if (imgSideLast) {
      imgSideLast.style.animation =
        "slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
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
  fetch("./data/novedades.json")
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
      // Eliminar botón anterior si ya existe
      const botonExistente = document.querySelector(".ver-mas-container");
      if (botonExistente) {
        botonExistente.remove();
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
  const tabs = document.querySelectorAll(".novedades-tabs .tab");

  // Función para controlar la visibilidad del botón "Ver más"
  function controlarVisibilidadBoton(mostrar) {
    let verMasContainer = document.querySelector(".ver-mas-container");
    
    if (mostrar) {
      // Si no existe el contenedor, lo creamos
      if (!verMasContainer) {
        
        verMasContainer = document.createElement("div");
        verMasContainer.className = "ver-mas-container";
        verMasContainer.innerHTML = '<a href="#" class="ver-mas-btn">VER MÁS ></a>';
        
        // Insertar después del mini-noticias-grid
        const miniNoticiasGrid = document.querySelector(".mini-noticias-grid");
        if (miniNoticiasGrid && miniNoticiasGrid.parentNode) {
          miniNoticiasGrid.parentNode.appendChild(verMasContainer);
        }
      }
      verMasContainer.style.display = "flex";
    } else {
      if (verMasContainer) {
        verMasContainer.style.display = "none";
      }
    }
  }

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

        controlarVisibilidadBoton(false);
      } else {
        // Pestaña NOTICIAS
        if (noticiaPrincipal) {
          noticiaPrincipal.style.display = "none";
        }

        if (miniNoticiasGrid && data.otrasNoticias) {
          miniNoticiasGrid.innerHTML = data.otrasNoticias
            .map(
              (noticia) => `
            <article class="mini-noticia noticia-completa">
              <div class="mini-noticia-img">
                <img src="${noticia.imagen}" alt="${noticia.titulo}">
              </div>
              <div class="mini-noticia-info">
                <h4>${noticia.titulo}</h4>
                <div class="noticia-metadata">
                  <span class="noticia-consola">${noticia.consola || "Nintendo Switch"}</span>
                  <span class="noticia-fecha">${noticia.fecha || ""}</span>
                </div>
              </div>
            </article>
          `,
            )
            .join("");
        }
        controlarVisibilidadBoton(true);
      }
    });
  });

  const juegosTabs = document.querySelectorAll(".juegos-tabs .tab");

  juegosTabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {
      // Cambiar pestaña activa solo en juegos
      juegosTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Aquí puedes añadir la lógica para filtrar juegos según la pestaña seleccionada
      console.log("Pestaña de juegos seleccionada:", index, this.textContent);

      // Ejemplo de filtrado (puedes implementar según tu JSON de juegos):
      filtrarJuegosPorCategoria(index);
    });
  });
}

// ========== CARGAR JUEGOS DESDE NUEVO JSON ==========
// Añade esta función al final de tu app.js

function cargarJuegos() {
  fetch("./data/juegos.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el JSON de juegos");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Juegos cargados:", data);

      const juegosContainer = document.getElementById("juegos-container");
      if (!juegosContainer) {
        console.error("No se encontró el elemento con id 'juegos-container'");
        return;
      }
      juegosContainer.innerHTML = data

        .map(
          (juego) => `
          <div class="juego-card">
          ${
            juego.esNuevaConsola
              ? `
              <div class="badge-consola">
                <img src="./fotos/logos/Nintendo_2.png" alt="Nueva Consola">
              </div>
              `
              : ""
          }
            <div class="juego-imagen">
            
              <img src="${juego.imagen || "./fotos/placeholder.jpg"}" alt="${juego.juego}">
            </div>
            <div class="juego-contenido">
              <div class="juego-fecha">${juego.plataforma} | ${juego.fecha}</div>
              <h3 class="juego-titulo">${juego.juego}</h3>
            </div>
            <div class="juego-favorito-container">
                <button class="juego-favorito" onclick="toggleFavorito(this)">
                  <i class="fa-regular fa-heart"></i>
                </button>
              </div>
          </div>
        `,
        )
        .join("");
    })
    .catch((error) => {
      console.error("Error al cargar juegos:", error);
      const juegosContainer = document.getElementById("juegos-container");
      if (juegosContainer) {
        juegosContainer.innerHTML =
          '<p style="padding: 20px; color: red;">Error al cargar los juegos</p>';
      }
    });
}

// Función para toggle de favorito
function toggleFavorito(boton) {
  const icono = boton.querySelector("i");

  if (icono.classList.contains("fa-regular")) {
    icono.classList.remove("fa-regular");
    icono.classList.add("fa-solid");
    boton.classList.add("activo");
  } else {
    icono.classList.remove("fa-solid");
    icono.classList.add("fa-regular");
    boton.classList.remove("activo");
  }
}
// Hacer la función global
window.toggleFavorito = toggleFavorito;

// Llamar a la función después de cargar las noticias
document.addEventListener("DOMContentLoaded", function () {
  cargarNoticias();
  cargarJuegos(); // Añade esta línea
});
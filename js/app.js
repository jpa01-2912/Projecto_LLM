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

fetch("/api/carrousel")
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
  // Cargar las noticias desde la API
  fetch("/api/novedades")
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
            <img src="${data.principal?.imagen || "./fotos/placeholder.jpg"}" alt="${data.principal?.titulo || ""}">
          </div>
          <div class="noticia-contenido">
            <span class="noticia-etiqueta">${data.principal?.etiqueta || ""}</span>
            <h3>${data.principal?.titulo || ""}</h3>
            <p>${data.principal?.descripcion || ""}</p>
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
        verMasContainer.innerHTML =
          '<a href="#" class="ver-mas-btn">VER MÁS ></a>';

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
              <img src="${data.principal?.imagen || "./fotos/placeholder.jpg"}" alt="${data.principal?.titulo || ""}">
            </div>
            <div class="noticia-contenido">
              <span class="noticia-etiqueta">${data.principal?.etiqueta || ""}</span>
              <h3>${data.principal?.titulo || ""}</h3>
              <p>${data.principal?.descripcion || ""}</p>
            </div>
          `;
        }

        if (miniNoticiasGrid) {
          miniNoticiasGrid.innerHTML = (data.secundarias || [])
            .map(
              (noticia) => `
            <article class="mini-noticia">
              <div class="mini-noticia-img">
                <img src="${noticia.imagen || "./fotos/placeholder.jpg"}" alt="${noticia.titulo || ""}">
              </div>
              <div class="mini-noticia-info">
                <span class="noticia-etiqueta">${noticia.etiqueta || ""}</span>
                <h4>${noticia.titulo || ""}</h4>
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

        if (miniNoticiasGrid) {
          miniNoticiasGrid.innerHTML = (data.otrasNoticias || [])
            .map(
              (noticia) => `
            <article class="mini-noticia noticia-completa">
              <div class="mini-noticia-img">
                <img src="${noticia.imagen || "./fotos/placeholder.jpg"}" alt="${noticia.titulo || ""}">
              </div>
              <div class="mini-noticia-info">
                <h4>${noticia.titulo || ""}</h4>
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
  fetch("/api/juegos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar la API de juegos");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Juegos cargadas desde API:", data);

      const juegosContainer = document.getElementById("juegos-container");
      if (!juegosContainer) {
        console.error("No se encontró el elemento con id 'juegos-container'");
        return;
      }

      // Obtener favoritos del localStorage
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

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
                <button class="juego-favorito ${favoritos.includes(juego.juego) ? "activo" : ""}" onclick="toggleFavorito(this, '${juego.juego.replace(/'/g, "\\'")}')">
                  <i class="${favoritos.includes(juego.juego) ? "fa-solid" : "fa-regular"} fa-heart"></i>
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

// ========== CARGAR APLICACIONES DESDE JSON ==========

function cargarAplicaciones() {
  fetch("/api/aplicaciones")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar la API de aplicaciones");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Aplicaciones cargadas:", data);

      const appsContainer = document.getElementById("apps-container");

      if (!appsContainer) {
        console.error("No se encontró el contenedor apps-container");
        return;
      }

      appsContainer.innerHTML = data
        .map(
          (app) => `
        <div class="app-card">

          <div class="app-imagen">
            <img src="${app.imagen}" alt="${app.aplicacion}">
          </div>

          <div class="app-info">
            <div class="app-meta">
              ${app.plataforma} | ${app.fecha}
            </div>

            <h3 class="app-titulo">
              ${app.aplicacion}
            </h3>

          </div>

        </div>
      `,
        )
        .join("");
    })
    .catch((error) => {
      console.error("Error al cargar aplicaciones:", error);

      const appsContainer = document.getElementById("apps-container");
      if (appsContainer) {
        appsContainer.innerHTML =
          '<p style="color:red;padding:20px;">Error al cargar aplicaciones</p>';
      }
    });
}

// ========== CARGAR MY NINTENDO STORE DESDE JSON ==========

function cargarMyNintendoStore() {
  fetch("/api/myNintendoStore")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar la API MyNintendoStore");
      }
      return response.json();
    })
    .then((data) => {
      // Buscamos el contenedor en el HTML que definiste
      const storeSection = document.querySelector(".my-nintendo-store-section");
      if (!storeSection) return;

      // Buscamos o creamos el grid
      let storeGrid = storeSection.querySelector(".store-grid");
      if (!storeGrid) {
        storeGrid = document.createElement("div");
        storeGrid.className = "store-grid";
        storeSection.appendChild(storeGrid);
      }

      // IMPORTANTE: Los nombres aquí deben ser item.aplicacion e item.descripcion
      storeGrid.innerHTML = data
        .map(
          (item) => `
        <div class="store-card">
          <div class="store-imagen">
            <img src="${item.imagen}" alt="${item.aplicacion}">
          </div>
          <div class="store-info">
            <div class="store-meta">${item.descripcion}</div>
            <h3 class="store-titulo">${item.aplicacion}</h3>
          </div>
        </div>
      `,
        )
        .join("");

      // Añadimos el botón si no existe
      if (!storeSection.querySelector(".store-footer")) {
        const botonHTML = `
          <div class="store-footer">
            <a href="#" class="store-btn-main">Ir a My Nintendo Store</a>
          </div>`;
        storeSection.insertAdjacentHTML("beforeend", botonHTML);
      }
    })
    .catch((error) => console.error("Error en Store:", error));
}

// Función para toggle de favorito y localStorage
function toggleFavorito(boton, juegoNombre) {
  const icono = boton.querySelector("i");
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (icono.classList.contains("fa-regular")) {
    icono.classList.remove("fa-regular");
    icono.classList.add("fa-solid");
    boton.classList.add("activo");

    // Añadir a localStorage
    if (!favoritos.includes(juegoNombre)) {
      favoritos.push(juegoNombre);
    }
  } else {
    icono.classList.remove("fa-solid");
    icono.classList.add("fa-regular");
    boton.classList.remove("activo");

    // Remover de localStorage
    favoritos = favoritos.filter((f) => f !== juegoNombre);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// ========== MENÚ DESPLEGABLE ==========
// DATOS DEL MENÚ
const menuData = {
  juegos: {
    title: "Juegos",
    items: [
      "Información",
      "Juegos de Nintendo Switch 2",
      "Juegos de Nintendo Switch",
      "Destacados del mes",
      "Lanzamientos recientes",
      "Próximos juegos",
      "Demos",
      "Juegos de instalación gratuita",
      "Contenido descargable",
      "Juegos de dispositivo inteligente",
      "Portal de Nintendo",
    ],
  },
  hardware: {
    title: "Hardware",
    items: [
      "Consolas",
      "Controles",
      "Accesorios",
      "Cuidado y limpieza",
      "Baterías",
    ],
  },
  online: {
    title: "Nintendo Switch Online",
    items: [
      "Planes de suscripción",
      "Juegos incluidos",
      "Beneficios",
      "Requisitos técnicos",
    ],
  },
  eshop: {
    title: "Nintendo eShop",
    items: [
      "Nuevos lanzamientos",
      "Ofertas",
      "Juegos destacados",
      "Géneros",
      "Mis compras",
    ],
  },
  mynintendo: {
    title: "My Nintendo Store",
    items: ["Puntos MyNintendo", "Recompensas", "Exclusivas", "Colecciones"],
  },
  seguenos: {
    title: "Síguenos",
    items: ["Facebook", "Twitter", "Instagram", "YouTube", "TikTok"],
  },
  mas: {
    title: "Más",
    items: [
      "Comunidad",
      "Centro de ayuda",
      "Contacto",
      "Privacidad",
      "Términos de servicio",
      "Accesibilidad",
    ],
  },
};

// Variables para el dropdown
let dropdownPanel = null;
let isDropdownVisible = false;

// FUNCIÓN PARA CREAR EL DROPDOWN PANEL
function crearDropdownPanel() {
  if (dropdownPanel) return;

  // Buscar el sidebar (la barra lateral izquierda)
  dropdownPanel = document.createElement("div");
  dropdownPanel.className = "dropdown-panel";

  dropdownPanel.innerHTML = `
        <h3 class="dropdown-title">Juegos</h3>
        <div class="dropdown-items" id="dropdownItemsContainer">
        </div>
        `;
  document.body.appendChild(dropdownPanel);
}

// FUNCIÓN PARA ACTUALIZAR EL CONTENIDO DEL DROPDOWN
function actualizarDropdown(menuKey) {
  if (!dropdownPanel) crearDropdownPanel();
  if (!dropdownPanel) return;

  const menu = menuData[menuKey];
  if (!menu) return;

  // Actualizar título
  const titleElement = dropdownPanel.querySelector(".dropdown-title");
  if (titleElement) titleElement.textContent = menu.title;

  // Actualizar items
  const container = dropdownPanel.querySelector("#dropdownItemsContainer");
  if (container) {
    container.innerHTML = "";

    menu.items.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "dropdown-item";
      itemDiv.textContent = item;
      itemDiv.onclick = (e) => {
        e.stopPropagation();
        console.log(`Seleccionado: ${item}`);
        alert(`Has seleccionado: ${item}`);
        cerrarDropdown();
      };
      container.appendChild(itemDiv);

      // Añadir divisor excepto después del último
      if (index < menu.items.length - 1) {
        const divider = document.createElement("div");
        divider.className = "divider";
        container.appendChild(divider);
      }
    });
  }
}

// FUNCIÓN PARA ABRIR EL DROPDOWN
function abrirDropdown(menuKey) {
  if (!dropdownPanel) crearDropdownPanel();
  if (!dropdownPanel) return;

  actualizarDropdown(menuKey);
  dropdownPanel.classList.add("active");
  isDropdownVisible = true;
}

// FUNCIÓN PARA CERRAR EL DROPDOWN
function cerrarDropdown() {
  if (dropdownPanel) {
    dropdownPanel.classList.remove("active");
    isDropdownVisible = false;
  }
}

// FUNCIÓN PARA ALTERNAR EL DROPDOWN
function toggleDropdown(menuKey) {
  if (isDropdownVisible) {
    cerrarDropdown();
  } else {
    abrirDropdown(menuKey);
  }
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener("click", function (event) {
  if (!isDropdownVisible) return;

  const sidebar = document.querySelector(".sidebar");
  const isClickOnSidebar = sidebar && sidebar.contains(event.target);
  const isClickOnDropdown =
    dropdownPanel && dropdownPanel.contains(event.target);

  if (!isClickOnSidebar && !isClickOnDropdown) {
    cerrarDropdown();
  }
});

window.selectMenu = function (menuKey) {
  toggleDropdown(menuKey);
  document.querySelectorAll(".side-item").forEach((el) => {
    el.classList.remove("active");
  });

  const clickedElement = document.querySelector(
    `.side-item[onclick="selectMenu('${menuKey}')"]`,
  );
  if (clickedElement) {
    clickedElement.classList.add("active");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  crearDropdownPanel();
});

// Hacer la función global
window.toggleFavorito = toggleFavorito;

// Llamar a la función después de cargar las noticias
document.addEventListener("DOMContentLoaded", function () {
  cargarNoticias();
  cargarJuegos();
  cargarAplicaciones();
  cargarMyNintendoStore();

  // === LÓGICA DE USUARIO LOGUEADO LOGUEADO ===
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (loggedUser) {
    // Buscar el botón de Iniciar Sesión en la barra superior
    const loginLink = document.querySelector(
      ".top-actions .action a[href='login.html']",
    );
    if (loginLink) {
      // Extraer el texto antes del @ para usarlo de nombre y poner la primera mayuscula
      let baseName = loggedUser.email.split("@")[0];
      let displayName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

      loginLink.textContent = "Hola, " + displayName;
      // Opcionalmente podrías cambiar el link a un dashboard o #
      // loginLink.href = "admin.html"; // Por si quieres mandarlo al admin

      // Modificar el contenedor para habilitar "Cerrar Sesión" de forma sutil
      const loginContainer = loginLink.parentElement;

      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.textContent = "(Salir)";
      logoutBtn.style.color = "#ccc";
      logoutBtn.style.fontSize = "12px";
      logoutBtn.style.marginLeft = "8px";

      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedUser");
        window.location.reload();
      });

      loginContainer.appendChild(logoutBtn);
    }
  }
});

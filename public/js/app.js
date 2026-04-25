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
// ========== CARGAR NOVEDADES (DESTACADAS) ==========

function cargarNovedades() {
  // Cargar las noticias desde la API
  fetch("/api/novedades")
    .then((response) => response.json())
    .then((data) => {
      console.log("Novedades cargadas:", data);

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

      // Cargar mini noticias secundarias
      const miniNoticiasGrid = document.querySelector(".mini-noticias-grid");
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
        `
          )
          .join("");
      }
    })
    .catch((error) => console.error("Error al cargar novedades:", error));
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
      if (!juegosContainer) return;

      // Usar 'wishlist' para consistencia con el catálogo y la página de deseos
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      juegosContainer.innerHTML = data
        .map((juego) => {
          const isInWishlist = wishlist.some(item => item.juego === juego.juego);
          return `
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
                  <button class="juego-favorito ${isInWishlist ? "activo" : ""}" data-game='${JSON.stringify(juego).replace(/'/g, "&apos;")}'>
                    <i class="${isInWishlist ? "fa-solid" : "fa-regular"} fa-heart"></i>
                  </button>
                </div>
            </div>
          `;
        })
        .join("");

      // Añadir eventos a los botones de favorito
      juegosContainer.querySelectorAll(".juego-favorito").forEach(btn => {
        btn.addEventListener("click", () => {
          const gameData = JSON.parse(btn.dataset.game);
          toggleFavorito(btn, gameData);
        });
      });
    })
    .catch((error) => {
      console.error("Error al cargar juegos:", error);
    });
}

// Función para toggle de favorito (ahora usando wishlist y objetos)
function toggleFavorito(boton, juego) {
  const icono = boton.querySelector("i");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const exists = wishlist.some(item => item.juego === juego.juego);

  if (!exists) {
    // Añadir
    icono.classList.remove("fa-regular");
    icono.classList.add("fa-solid");
    boton.classList.add("activo");
    wishlist.push(juego);
    showToastHome(`${juego.juego} añadido a la lista de deseos`, "fa-heart");
  } else {
    // Quitar
    icono.classList.remove("fa-solid");
    icono.classList.add("fa-regular");
    boton.classList.remove("activo");
    wishlist = wishlist.filter(item => item.juego !== juego.juego);
    showToastHome(`${juego.juego} eliminado de la lista`, "fa-heart-crack");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Toast sutil para el index
function showToastHome(message, icon = "fa-check") {
  let toast = document.querySelector(".home-toast");
  if (toast) toast.remove();

  toast = document.createElement("div");
  toast.className = "home-toast";
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #1a1a1a; color: white; padding: 12px 24px; border-radius: 30px;
    font-size: 14px; font-weight: 600; z-index: 10000; opacity: 0; transition: 0.3s;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px;
  `;
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: #e60012;"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ========== CARGAR APLICACIONES DESDE JSON ==========

function cargarAplicaciones() {
  fetch("/api/aplicaciones")
    .then((response) => response.json())
    .then((data) => {
      const appsContainer = document.getElementById("apps-container");
      if (!appsContainer) return;

      appsContainer.innerHTML = data
        .map(app => `
          <div class="app-card">
            <div class="app-imagen">
              <img src="${app.imagen}" alt="${app.aplicacion}">
            </div>
            <div class="app-info">
              <div class="app-meta">${app.plataforma} | ${app.fecha}</div>
              <h3 class="app-titulo">${app.aplicacion}</h3>
            </div>
          </div>
        `).join("");
    })
    .catch((error) => console.error("Error al cargar aplicaciones:", error));
}

// ========== CARGAR MY NINTENDO STORE DESDE JSON ==========

function cargarMyNintendoStore() {
  fetch("/api/myNintendoStore")
    .then((response) => response.json())
    .then((data) => {
      const storeSection = document.querySelector(".my-nintendo-store-section");
      if (!storeSection) return;

      let storeGrid = storeSection.querySelector(".store-grid");
      if (!storeGrid) {
        storeGrid = document.createElement("div");
        storeGrid.className = "store-grid";
        storeSection.appendChild(storeGrid);
      }

      storeGrid.innerHTML = data
        .map(item => `
          <div class="store-card">
            <div class="store-imagen">
              <img src="${item.imagen}" alt="${item.aplicacion}">
            </div>
            <div class="store-info">
              <div class="store-meta">${item.descripcion}</div>
              <h3 class="store-titulo">${item.aplicacion}</h3>
            </div>
          </div>
        `).join("");
    })
    .catch((error) => console.error("Error en Store:", error));
}

// ========== CARGAR NOTICIAS (GRID DE 8) ==========

// ========== CARGAR NOTICIAS (GRID DE 8) ==========

function cargarNoticiasGrid() {
  fetch("/api/noticias")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("noticias-container");
      if (!container) return;

      const displayData = data.slice(0, 8);

      container.innerHTML = displayData
        .map(n => `
          <div class="noticia-card-simple" onclick="window.location.href='${n.link || '#'}'">
            <div class="card-img">
              <img src="${n.imagen || './fotos/placeholder.jpg'}" alt="${n.titulo}" onerror="this.src='./fotos/placeholder.jpg'">
            </div>
            <div class="card-body">
              <div class="card-etiqueta">${n.etiqueta || ''}</div>
              <h3>${n.titulo}</h3>
              <div class="card-meta">${n.fecha || ''}</div>
            </div>
          </div>
        `).join("");
    })
    .catch((error) => console.error("Error al cargar noticias grid:", error));
}

// ========== LÓGICA DE PESTAÑAS NOVEDADES ==========

function setupNovedadesTabs() {
  const tabs = document.querySelectorAll(".novedades-tabs .tab");
  const viewDestacadas = document.getElementById("view-destacadas");
  const viewNoticias = document.getElementById("view-noticias");

  if (!tabs.length || !viewDestacadas || !viewNoticias) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // UI de pestañas
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Cambio de vistas
      const target = tab.dataset.target;
      if (target === "noticias") {
        viewDestacadas.classList.add("hidden");
        viewNoticias.classList.remove("hidden");
        cargarNoticiasGrid();
      } else {
        viewDestacadas.classList.remove("hidden");
        viewNoticias.classList.add("hidden");
        cargarNovedades();
      }
    });
  });
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
  cargarNovedades();
  cargarJuegos();
  cargarAplicaciones();
  cargarMyNintendoStore();
  setupNovedadesTabs();

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

const menuData = {
  juegos: {
    title: "Juegos",
    items: [
      "Informacion",
      "Juegos de Nintendo Switch 2",
      "Juegos de Nintendo Switch",
      "Destacados del mes",
      "Lanzamientos recientes",
      "Proximos juegos",
      "Demos",
      "Juegos de instalacion gratuita",
      "Contenido descargable",
      "Juegos de dispositivo inteligente",
      "Portal de Nintendo",
    ],
  },
  hardware: {
    title: "Hardware",
    items: ["Consolas", "Controles", "Accesorios", "Cuidado y limpieza", "Baterias"],
  },
  online: {
    title: "Nintendo Switch Online",
    items: ["Planes de suscripcion", "Juegos incluidos", "Beneficios", "Requisitos tecnicos"],
  },
  eshop: {
    title: "Nintendo eShop",
    items: ["Nuevos lanzamientos", "Ofertas", "Juegos destacados", "Generos", "Mis compras"],
  },
  mynintendo: {
    title: "My Nintendo Store",
    items: ["Puntos MyNintendo", "Recompensas", "Exclusivas", "Colecciones"],
  },
  seguenos: {
    title: "Siguenos",
    items: ["Facebook", "Twitter", "Instagram", "YouTube", "TikTok"],
  },
  mas: {
    title: "Mas",
    items: ["Comunidad", "Centro de ayuda", "Contacto", "Privacidad", "Terminos de servicio", "Accesibilidad"],
  },
};

export function initDropdown() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  let dropdownPanel = null;
  let isDropdownVisible = false;

  function createDropdownPanel() {
    if (dropdownPanel) return dropdownPanel;

    dropdownPanel = document.createElement("div");
    dropdownPanel.className = "dropdown-panel";
    dropdownPanel.innerHTML = `
      <h3 class="dropdown-title">Juegos</h3>
      <div class="dropdown-items" id="dropdownItemsContainer"></div>
    `;
    document.body.appendChild(dropdownPanel);
    return dropdownPanel;
  }

  function updateDropdown(menuKey) {
    const panel = createDropdownPanel();
    const menu = menuData[menuKey];
    if (!menu) return;

    const titleElement = panel.querySelector(".dropdown-title");
    const container = panel.querySelector("#dropdownItemsContainer");
    if (titleElement) titleElement.textContent = menu.title;
    if (!container) return;

    container.innerHTML = "";
    menu.items.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "dropdown-item";
      itemDiv.textContent = item;
      itemDiv.addEventListener("click", (event) => {
        event.stopPropagation();
        window.alert(`Has seleccionado: ${item}`);
        closeDropdown();
      });
      container.appendChild(itemDiv);

      if (index < menu.items.length - 1) {
        const divider = document.createElement("div");
        divider.className = "divider";
        container.appendChild(divider);
      }
    });
  }

  function openDropdown(menuKey) {
    const panel = createDropdownPanel();
    updateDropdown(menuKey);
    panel.classList.add("active");
    isDropdownVisible = true;
  }

  function closeDropdown() {
    if (!dropdownPanel) return;
    dropdownPanel.classList.remove("active");
    isDropdownVisible = false;
  }

  function toggleDropdown(menuKey) {
    if (isDropdownVisible) {
      closeDropdown();
      return;
    }

    openDropdown(menuKey);
  }

  document.addEventListener("click", (event) => {
    if (!isDropdownVisible) return;

    const isClickOnSidebar = sidebar.contains(event.target);
    const isClickOnDropdown = dropdownPanel?.contains(event.target);
    if (!isClickOnSidebar && !isClickOnDropdown) {
      closeDropdown();
    }
  });

  window.selectMenu = (menuKey) => {
    toggleDropdown(menuKey);
    document.querySelectorAll(".side-item").forEach((element) => {
      element.classList.remove("active");
    });

    const clickedElement = document.querySelector(`.side-item[onclick="selectMenu('${menuKey}')"]`);
    if (clickedElement) {
      clickedElement.classList.add("active");
    }
  };

  createDropdownPanel();
}

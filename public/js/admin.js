document.addEventListener("DOMContentLoaded", () => {
  // --- SEGURIDAD Y ROLES ---
  const loggedUserString = localStorage.getItem("loggedUser");
  if (!loggedUserString) {
    window.location.href = "login.html";
    return;
  }

  const loggedUser = JSON.parse(loggedUserString);
  const userRole = loggedUser.rol;

  // Redirigir si no tiene rango administrativo
  const adminRoles = ["admin", "content_editor", "game_manager"];
  if (!adminRoles.includes(userRole)) {
    alert("No tienes permisos para acceder al panel de administración.");
    window.location.href = "index.html";
    return;
  }

  // Actualizar perfil de usuario en el top-nav
  const profileImg = document.querySelector(".user-profile img");
  const profileName = document.querySelector(".user-profile span");
  if (profileImg) profileImg.src = loggedUser.avatar || "https://ui-avatars.com/api/?name=User&background=E60012&color=fff";
  if (profileName) profileName.textContent = loggedUser.nombre || "Usuario";

  // --- ELEMENTOS DOM ---
  const navLinksContainer = document.querySelector(".nav-links");
  const pageTitle = document.getElementById("pageTitle");
  const searchInput = document.getElementById("searchInput");
  const tableHeaderLine = document.getElementById("tableHeaderLine");
  const tableBody = document.getElementById("tableBody");
  const addNewBtn = document.getElementById("addNewBtn");
  const addModal = document.getElementById("addModal");
  const closeButtons = document.querySelectorAll(".close-modal");
  const saveBtn = document.getElementById("saveBtn");
  const jsonInput = document.getElementById("jsonInput");
  const jsonError = document.getElementById("jsonError");
  const statTotalNumber = document.getElementById("statTotalNumber");
  const statDbCount = document.getElementById("statDbCount");
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    });
  }

  const novedadesEditor = document.getElementById("novedadesEditor");
  const principalImagen = document.getElementById("principalImagen");
  const principalEtiqueta = document.getElementById("principalEtiqueta");
  const principalTitulo = document.getElementById("principalTitulo");
  const principalDescripcion = document.getElementById("principalDescripcion");
  const secundariasList = document.getElementById("secundariasList");
  const saveNovedadesBtn = document.getElementById("saveNovedadesBtn");
  const novedadesJsonError = document.getElementById("novedadesJsonError");

  // --- CONFIGURACIÓN DE ROLES Y ENDPOINTS ---
  const rolePermissions = {
    admin: ["usuarios", "juegos", "aplicaciones", "carrousel", "myNintendoStore", "novedades", "noticias"],
    content_editor: ["carrousel", "myNintendoStore", "novedades", "noticias"],
    game_manager: ["juegos"]
  };

  const allowedEndpoints = rolePermissions[userRole] || [];

  // Filtrar el menú lateral según el rol
  const allNavItems = document.querySelectorAll(".nav-links li");
  let firstAllowedEndpoint = null;

  allNavItems.forEach(li => {
    const endpoint = li.dataset.endpoint;
    if (allowedEndpoints.includes(endpoint)) {
      li.style.display = "flex";
      if (!firstAllowedEndpoint) firstAllowedEndpoint = endpoint;
    } else {
      li.style.display = "none";
    }
  });

  let currentEndpoint = firstAllowedEndpoint || "juegos";
  let currentData = [];

  // Marcar el primer item permitido como activo
  const activeNavItem = document.querySelector(`.nav-links li[data-endpoint="${currentEndpoint}"]`);
  if (activeNavItem) {
    allNavItems.forEach(l => l.classList.remove("active"));
    activeNavItem.classList.add("active");
  }

  // Mapeo de endpoint a ruta API
  const apiMap = {
    usuarios: { url: "/api/usuarios", idField: "id" },
    juegos: { url: "/api/juegos", idField: "id" },
    aplicaciones: { url: "/api/aplicaciones", idField: "id" },
    carrousel: { url: "/api/carrousel", idField: "id" },
    myNintendoStore: { url: "/api/myNintendoStore", idField: "id" },
    novedades: { url: "/api/novedades", idField: null },
    noticias: { url: "/api/noticias", idField: "id" },
  };

  function fetchData(endpoint) {
    const api = apiMap[endpoint];
    if (!api) return;

    if (endpoint === "novedades") {
      tableHeaderLine.innerHTML = "<th>Cargando...</th>";
      tableBody.innerHTML = "";
      showNovedadesEditor(true);
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = data;
          renderNovedadesEditor(data);
        })
        .catch((err) => {
          console.error(err);
          novedadesJsonError.textContent = "Error al cargar novedades: " + err.message;
          novedadesJsonError.style.display = "block";
        });
    } else {
      showNovedadesEditor(false);
      tableHeaderLine.innerHTML = "<th>Cargando...</th>";
      tableBody.innerHTML = "";
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = Array.isArray(data) ? data : [data];
          renderTable(currentData, false);
        })
        .catch((err) => {
          console.error(err);
          tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
        });
    }
  }

  function renderTable(dataArray, isNovedades = false) {
    tableHeaderLine.innerHTML = "";
    tableBody.innerHTML = "";
    if (!dataArray || dataArray.length === 0) {
      statTotalNumber.textContent = 0;
      tableHeaderLine.innerHTML = "<th>Vacío</th>";
      tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
      return;
    }
    statTotalNumber.textContent = dataArray.length;
    const headers = Object.keys(dataArray[0]);
    headers.forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key;
      tableHeaderLine.appendChild(th);
    });
    const thAcciones = document.createElement("th");
    thAcciones.textContent = "Acciones";
    tableHeaderLine.appendChild(thAcciones);

    dataArray.forEach((item, idx) => {
      const tr = document.createElement("tr");
      headers.forEach((key) => {
        const td = document.createElement("td");
        let valor = item[key];
        if (key === "link") {
          td.innerHTML = `<a href="${valor}" target="_blank" style="color: blue; text-decoration: underline;">${valor}</a>`;
        } else if (
          typeof valor === "string" &&
          (valor.includes(".jpg") || valor.includes(".png") || valor.includes("http"))
        ) {
          td.classList.add("img-cell");
          td.innerHTML = `<img src="${valor}" alt="preview" onerror="this.src='./fotos/placeholder.jpg'" style="max-width:80px;">`;
        } else if (typeof valor === "object") {
          td.textContent = JSON.stringify(valor);
        } else {
          td.textContent = valor;
        }
        tr.appendChild(td);
      });
      
      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "5px";
      
      const btnEdit = document.createElement("button");
      btnEdit.className = "primary-btn";
      btnEdit.style.padding = "5px 10px";
      btnEdit.style.fontSize = "12px";
      btnEdit.innerHTML = '<i class="fa-solid fa-edit"></i> Editar';
      
      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.fontSize = "12px";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      
      const idToModify = item.id !== undefined ? item.id : idx;
      
      btnEdit.onclick = () => editItem(item, isNovedades);
      btnDelete.onclick = () => deleteItem(idToModify, isNovedades);
      
      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);
      tableBody.appendChild(tr);
    });
  }

  let editingId = null;

  function editItem(item, isNovedades) {
    if (isNovedades) {
      alert("Para editar novedades usa el panel editor abajo.");
      return;
    }
    editingId = item.id;
    jsonInput.value = JSON.stringify(item, null, 2);
    jsonError.style.display = "none";
    document.getElementById("modalTitle").textContent = "Editar Elemento";
    addModal.classList.add("active");
  }

  function deleteItem(idOrIndex, isNovedades) {
    if (!confirm("¿Eliminar permanentemente?")) return;
    const api = apiMap[currentEndpoint];
    if (!api) return;

    let url = `${api.url}/${idOrIndex}`;
    if (isNovedades) {
      alert("Para eliminar una novedad secundaria, usa el editor JSON o modifica el backend.");
      return;
    }
    fetch(url, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchData(currentEndpoint))
      .catch((err) => alert("Error al eliminar: " + err.message));
  }

  addNewBtn.addEventListener("click", () => {
    editingId = null;
    document.getElementById("modalTitle").textContent = "Añadir Nuevo Elemento";
    jsonInput.value = "";
    jsonError.style.display = "none";
    let placeholderObj = {};
    if (currentData && currentData.length > 0) {
      const { id, ...rest } = currentData[0];
      placeholderObj = rest;
      jsonInput.value = JSON.stringify(placeholderObj, null, 2);
    }
    addModal.classList.add("active");
  });

  saveBtn.addEventListener("click", () => {
    if (currentEndpoint === "novedades") {
      alert("Usa el editor de novedades para guardar el objeto completo.");
      return;
    }
    const jsonText = jsonInput.value;
    let newObj;
    try {
      newObj = JSON.parse(jsonText);
      jsonError.style.display = "none";
    } catch (e) {
      jsonError.style.display = "block";
      return;
    }
    const api = apiMap[currentEndpoint];
    if (!api) return;
    
    let url = api.url;
    let method = "POST";
    
    if (editingId !== null) {
      url = `${api.url}/${editingId}`;
      method = "PUT";
    }
    
    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newObj),
    })
      .then((res) => res.json())
      .then(() => {
        addModal.classList.remove("active");
        fetchData(currentEndpoint);
      })
      .catch((err) => alert("Error al guardar: " + err.message));
  });

  function renderNovedadesEditor(data) {
    if (!novedadesEditor || !novedadesJsonError) return;
    const safeData = data || { principal: {}, secundarias: [], otrasNoticias: [] };
    currentData = safeData;
    if (principalImagen) principalImagen.value = safeData.principal?.imagen || "";
    if (principalEtiqueta) principalEtiqueta.value = safeData.principal?.etiqueta || "";
    if (principalTitulo) principalTitulo.value = safeData.principal?.titulo || "";
    if (principalDescripcion) principalDescripcion.value = safeData.principal?.descripcion || "";
    renderSecundariasList(safeData.secundarias || []);
    novedadesJsonError.style.display = "none";
  }

  function renderSecundariasList(items) {
    if (!secundariasList) return;
    const cards = [...items];
    while (cards.length < 4) {
      cards.push({ imagen: "", etiqueta: "", titulo: "" });
    }
    if (cards.length > 4) {
      cards.length = 4;
    }
    currentData.secundarias = cards;
    secundariasList.innerHTML = "";
    cards.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "novedades-item";
      card.innerHTML = `
        <div class="item-header">
          <span>Tarjeta ${index + 1}</span>
        </div>
        <div class="field-grid">
          <div class="field-group">
            <label>Ruta de imagen</label>
            <input type="text" value="${item.imagen || ""}" data-key="imagen" placeholder="./fotos/ejemplo.jpg" />
          </div>
          <div class="field-group">
            <label>Tipo de Sección</label>
            <input type="text" value="${item.etiqueta || ""}" data-key="etiqueta" placeholder="Ej. Juegos" />
          </div>
          <div class="field-group" style="grid-column: 1 / -1;">
            <label>Título</label>
            <input type="text" value="${item.titulo || ""}" data-key="titulo" placeholder="Título" />
          </div>
        </div>
      `;
      card.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
          currentData.secundarias[index][input.dataset.key] = input.value;
        });
      });
      secundariasList.appendChild(card);
    });
  }

  function getNovedadesPayload() {
    return {
      principal: {
        imagen: principalImagen?.value.trim() || "",
        etiqueta: principalEtiqueta?.value.trim() || "",
        titulo: principalTitulo?.value.trim() || "",
        descripcion: principalDescripcion?.value.trim() || "",
      },
      secundarias: currentData.secundarias || [],
      otrasNoticias: currentData.otrasNoticias || [],
    };
  }

  function showNovedadesEditor(show) {
    if (!novedadesEditor) return;
    novedadesEditor.classList.toggle("hidden", !show);
    document.getElementById("tableContainer").classList.toggle("hidden", show);
    addNewBtn.style.display = show ? "none" : "inline-flex";
    if (!show) {
      novedadesJsonError.style.display = "none";
    }
  }

  function saveNovedades() {
    const payload = getNovedadesPayload();
    fetch("/api/novedades", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar novedades");
        return res.json();
      })
      .then(() => {
        alert("Novedades actualizadas correctamente.");
        fetchData("novedades");
      })
      .catch((err) => {
        novedadesJsonError.textContent = err.message;
        novedadesJsonError.style.display = "block";
      });
  }

  saveNovedadesBtn?.addEventListener("click", saveNovedades);

  // Cambio de pestaña
  const navLinksItems = document.querySelectorAll(".nav-links li");
  navLinksItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("active")) return;
      navLinksItems.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      currentEndpoint = link.dataset.endpoint;
      pageTitle.textContent = "Gestión de " + link.querySelector("span").textContent;
      fetchData(currentEndpoint);
    });
  });

  // Búsqueda frontend
  searchInput.addEventListener("input", (e) => {
    if (currentEndpoint === "novedades") return;
    const val = e.target.value.toLowerCase();
    if (!val) {
      renderTable(currentData, false);
      return;
    }
    const filtered = currentData.filter((item) =>
      Object.values(item).some((v) => String(v).toLowerCase().includes(val)),
    );
    renderTable(filtered, false);
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => addModal.classList.remove("active"));
  });

  // Fetch stats iniciales
  fetch("/api/stats/db")
    .then((res) => res.json())
    .then((data) => {
      if (statDbCount) statDbCount.textContent = `${data.total} Tablas`;
    })
    .catch((err) => console.error("Error cargando tablas:", err));

  // Cargar datos iniciales
  fetchData(currentEndpoint);
});


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
  if (profileImg)
    profileImg.src =
      loggedUser.avatar ||
      "https://ui-avatars.com/api/?name=User&background=E60012&color=fff";
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
    admin: [
      "usuarios",
      "juegos",
      "aplicaciones",
      "carrousel",
      "myNintendoStore",
      "novedades",
      "noticias",
    ],
    content_editor: ["carrousel", "myNintendoStore", "novedades", "noticias"],
    game_manager: ["juegos"],
  };

  const allowedEndpoints = rolePermissions[userRole] || [];

  // Filtrar el menú lateral según el rol
  const allNavItems = document.querySelectorAll(".nav-links li");
  let firstAllowedEndpoint = null;

  allNavItems.forEach((li) => {
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
  let currentEtiquetas = [];

  // Marcar el primer item permitido como activo
  const activeNavItem = document.querySelector(
    `.nav-links li[data-endpoint="${currentEndpoint}"]`,
  );
  if (activeNavItem) {
    allNavItems.forEach((l) => l.classList.remove("active"));
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

  // Variables para datos compartidos
  let currentPlataformas = [];

  // Cargar datos necesarios al inicio
  function loadSharedData() {
    fetch("/api/etiquetas")
      .then((res) => res.json())
      .then((data) => {
        currentEtiquetas = Array.isArray(data) ? data : [];
      })
      .catch((err) => console.error("Error cargando etiquetas:", err));

    fetch("/api/plataformas")
      .then((res) => res.json())
      .then((data) => {
        currentPlataformas = Array.isArray(data) ? data : [];
      })
      .catch((err) => console.error("Error cargando plataformas:", err));
  }

  loadSharedData();

  function fetchData(endpoint) {
    const api = apiMap[endpoint];
    if (!api) return;

    tableHeaderLine.innerHTML = "<th>Cargando...</th>";
    tableBody.innerHTML = "";
    showNovedadesEditor(false);

    if (endpoint === "usuarios") {
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = Array.isArray(data) ? data : [data];
          renderUsuariosPanel(currentData);
        })
        .catch((err) => {
          console.error(err);
          tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
        });
    } else if (endpoint === "juegos") {
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = Array.isArray(data) ? data : [data];
          renderJuegosPanel(currentData);
        })
        .catch((err) => {
          console.error(err);
          tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
        });
    } else if (endpoint === "aplicaciones") {
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = Array.isArray(data) ? data : [data];
          renderAplicacionesPanel(currentData);
        })
        .catch((err) => {
          console.error(err);
          tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
        });
    } else if (endpoint === "carrousel") {
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = Array.isArray(data) ? data : [data];
          renderCarrouselPanel(currentData);
        })
        .catch((err) => {
          console.error(err);
          tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
        });
    } else if (endpoint === "myNintendoStore") {
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = Array.isArray(data) ? data : [data];
          renderTiendaPanel(currentData);
        })
        .catch((err) => {
          console.error(err);
          tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
        });
    } else if (endpoint === "noticias") {
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = Array.isArray(data) ? data : [data];
          renderNoticiasPanel(currentData);
        })
        .catch((err) => {
          console.error(err);
          tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
        });
    } else if (endpoint === "novedades") {
      showNovedadesEditor(true);
      fetch(api.url)
        .then((res) => res.json())
        .then((data) => {
          currentData = data;
          renderNovedadesEditor(data);
        })
        .catch((err) => {
          console.error(err);
          novedadesJsonError.textContent =
            "Error al cargar novedades: " + err.message;
          novedadesJsonError.style.display = "block";
        });
    } else {
      // Tabla genérica para otros endpoints
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

  // ============================================================
  // PANEL DE GESTIÓN DE USUARIOS
  // ============================================================
  function renderUsuariosPanel(usuarios) {
    tableHeaderLine.innerHTML = "";
    tableBody.innerHTML = "";
    if (!usuarios || usuarios.length === 0) {
      statTotalNumber.textContent = 0;
      tableHeaderLine.innerHTML = "<th>Vacío</th>";
      tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
      return;
    }

    statTotalNumber.textContent = usuarios.length;

    // Headers
    const headers = [
      "Avatar",
      "Nombre",
      "Email",
      "Rol",
      "Estado",
      "Fecha Registro",
      "Acciones",
    ];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeaderLine.appendChild(th);
    });

    // Filas
    usuarios.forEach((usuario) => {
      const tr = document.createElement("tr");

      // Avatar
      const tdAvatar = document.createElement("td");
      tdAvatar.classList.add("img-cell");
      tdAvatar.innerHTML = `<img src="${usuario.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(usuario.nombre)}" alt="${usuario.nombre}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`;
      tr.appendChild(tdAvatar);

      // Nombre
      const tdNombre = document.createElement("td");
      tdNombre.textContent = usuario.nombre;
      tr.appendChild(tdNombre);

      // Email
      const tdEmail = document.createElement("td");
      tdEmail.textContent = usuario.email;
      tr.appendChild(tdEmail);

      // Rol (badge)
      const tdRol = document.createElement("td");
      const rolBadge = document.createElement("span");
      rolBadge.classList.add("badge", `badge-${usuario.rol}`);
      rolBadge.textContent =
        usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1);
      tdRol.appendChild(rolBadge);
      tr.appendChild(tdRol);

      // Estado (badge)
      const tdEstado = document.createElement("td");
      const estadoBadge = document.createElement("span");
      estadoBadge.classList.add("badge", `badge-${usuario.estado}`);
      estadoBadge.textContent =
        usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1);
      tdEstado.appendChild(estadoBadge);
      tr.appendChild(tdEstado);

      // Fecha Registro
      const tdFecha = document.createElement("td");
      const fecha = new Date(usuario.fecha_registro).toLocaleDateString(
        "es-ES",
      );
      tdFecha.textContent = fecha;
      tr.appendChild(tdFecha);

      // Acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "5px";

      const btnEdit = document.createElement("button");
      btnEdit.className = "primary-btn";
      btnEdit.style.padding = "5px 10px";
      btnEdit.style.fontSize = "12px";
      btnEdit.innerHTML = '<i class="fa-solid fa-edit"></i> Editar';
      btnEdit.onclick = () => openUsuarioModal(usuario);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.fontSize = "12px";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      btnDelete.onclick = () => deleteUsuario(usuario.id);

      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);

      tableBody.appendChild(tr);
    });
  }

  let editingUsuarioId = null;

  function openUsuarioModal(usuario = null) {
    editingUsuarioId = usuario ? usuario.id : null;
    document.getElementById("modalTitle").textContent = usuario
      ? "Editar Usuario"
      : "Nuevo Usuario";

    // Crear form dinámico
    jsonInput.style.display = "none";
    const formContainer = document.getElementById("usuarioFormContainer");
    if (formContainer) formContainer.remove();

    const form = document.createElement("div");
    form.id = "usuarioFormContainer";
    form.className = "usuario-form";
    form.innerHTML = `
      <div class="form-group">
        <label for="usuarioNombre">Nombre</label>
        <input type="text" id="usuarioNombre" value="${usuario?.nombre || ""}" placeholder="Nombre del usuario">
      </div>
      <div class="form-group">
        <label for="usuarioEmail">Email</label>
        <input type="email" id="usuarioEmail" value="${usuario?.email || ""}" placeholder="usuario@example.com">
      </div>
      <div class="form-group">
        <label for="usuarioPassword">Password <button type="button" id="togglePassword" class="toggle-password-btn" style="background: none; border: none; cursor: pointer; color: #666; margin-left: 5px;"><i class="fa-solid fa-eye"></i></button></label>
        <input type="password" id="usuarioPassword" value="${usuario?.password || ""}" placeholder="Contraseña">
      </div>
      <div class="form-group">
        <label for="usuarioRol">Rol</label>
        <select id="usuarioRol">
          <option value="user" ${usuario?.rol === "user" ? "selected" : ""}>User</option>
          <option value="admin" ${usuario?.rol === "admin" ? "selected" : ""}>Admin</option>
          <option value="content_editor" ${usuario?.rol === "content_editor" ? "selected" : ""}>Content Editor</option>
          <option value="game_manager" ${usuario?.rol === "game_manager" ? "selected" : ""}>Game Manager</option>
        </select>
      </div>
      <div class="form-group">
        <label for="usuarioEstado">Estado</label>
        <select id="usuarioEstado">
          <option value="activo" ${usuario?.estado === "activo" ? "selected" : ""}>Activo</option>
          <option value="inactivo" ${usuario?.estado === "inactivo" ? "selected" : ""}>Inactivo</option>
          <option value="bloqueado" ${usuario?.estado === "bloqueado" ? "selected" : ""}>Bloqueado</option>
        </select>
      </div>
      <div class="form-group">
        <label for="usuarioAvatar">Avatar (URL)</label>
        <input type="text" id="usuarioAvatar" value="${usuario?.avatar || ""}" placeholder="https://ejemplo.com/avatar.jpg">
        <div id="avatarPreview" style="margin-top: 10px;">
          ${usuario?.avatar ? `<img src="${usuario.avatar}" alt="avatar" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">` : ""}
        </div>
      </div>
    `;

    document.getElementById("modalBody").insertBefore(form, jsonInput);

    // Evento para toggle de password
    document.getElementById("togglePassword").addEventListener("click", (e) => {
      e.preventDefault();
      const input = document.getElementById("usuarioPassword");
      const btn = document.getElementById("togglePassword");
      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      } else {
        input.type = "password";
        btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
      }
    });

    // Preview de avatar
    document.getElementById("usuarioAvatar").addEventListener("input", (e) => {
      const preview = document.getElementById("avatarPreview");
      const url = e.target.value.trim();
      if (url) {
        preview.innerHTML = `<img src="${url}" alt="avatar" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'">`;
      } else {
        preview.innerHTML = "";
      }
    });

    jsonError.style.display = "none";
    addModal.classList.add("active");
  }

  function deleteUsuario(usuarioId) {
    if (!confirm("¿Eliminar este usuario permanentemente?")) return;

    fetch(`/api/usuarios/${usuarioId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        alert("Usuario eliminado correctamente");
        fetchData("usuarios");
      })
      .catch((err) => alert("Error al eliminar: " + err.message));
  }

  // ============================================================
  // PANEL DE JUEGOS
  // ============================================================
  function renderJuegosPanel(juegos) {
    tableHeaderLine.innerHTML = "";
    tableBody.innerHTML = "";
    if (!juegos || juegos.length === 0) {
      statTotalNumber.textContent = 0;
      tableHeaderLine.innerHTML = "<th>Vacío</th>";
      tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
      return;
    }

    statTotalNumber.textContent = juegos.length;

    const headers = [
      "Imagen",
      "Título",
      "Plataforma",
      "Fecha Lanzamiento",
      "Precio",
      "Nueva Consola",
      "Acciones",
    ];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeaderLine.appendChild(th);
    });

    juegos.forEach((juego) => {
      const tr = document.createElement("tr");

      // Imagen
      const tdImagen = document.createElement("td");
      tdImagen.classList.add("img-cell");
      tdImagen.innerHTML = `<img src="${juego.imagen}" alt="${juego.titulo}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;" onerror="this.src='./fotos/placeholder.jpg'">`;
      tr.appendChild(tdImagen);

      // Título
      const tdTitulo = document.createElement("td");
      tdTitulo.textContent = juego.titulo;
      tr.appendChild(tdTitulo);

      // Plataforma
      const tdPlataforma = document.createElement("td");
      tdPlataforma.textContent = juego.plataforma || "N/A";
      tr.appendChild(tdPlataforma);

      // Fecha
      const tdFecha = document.createElement("td");
      tdFecha.textContent = juego.fecha || "N/A";
      tr.appendChild(tdFecha);

      // Precio
      const tdPrecio = document.createElement("td");
      tdPrecio.innerHTML = juego.precio
        ? `<strong>$${parseFloat(juego.precio).toFixed(2)}</strong>`
        : "Gratis";
      tr.appendChild(tdPrecio);

      // Nueva Consola
      const tdNuevaConsola = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `badge ${juego.esNuevaConsola ? "badge-success" : "badge-muted"}`;
      badge.textContent = juego.esNuevaConsola ? "Sí" : "No";
      tdNuevaConsola.appendChild(badge);
      tr.appendChild(tdNuevaConsola);

      // Acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "5px";

      const btnEdit = document.createElement("button");
      btnEdit.className = "primary-btn";
      btnEdit.style.padding = "5px 10px";
      btnEdit.style.fontSize = "12px";
      btnEdit.innerHTML = '<i class="fa-solid fa-edit"></i> Editar';
      btnEdit.onclick = () => openJuegoModal(juego);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.fontSize = "12px";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      btnDelete.onclick = () => deleteItem(juego.id, false);

      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);

      tableBody.appendChild(tr);
    });
  }

  let editingJuegoId = null;

  function openJuegoModal(juego = null) {
    editingJuegoId = juego ? juego.id : null;
    document.getElementById("modalTitle").textContent = juego
      ? "Editar Juego"
      : "Nuevo Juego";

    jsonInput.style.display = "none";
    const formContainer = document.getElementById("juegoFormContainer");
    if (formContainer) formContainer.remove();

    const form = document.createElement("div");
    form.id = "juegoFormContainer";
    form.className = "form-container";
    form.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label for="juegoTitulo">Título</label>
          <input type="text" id="juegoTitulo" value="${juego?.titulo || ""}" placeholder="Título del juego">
        </div>
        <div class="form-group">
          <label for="juegoPrecio">Precio</label>
          <input type="number" id="juegoPrecio" value="${juego?.precio || ""}" placeholder="0.00" step="0.01">
        </div>
        <div class="form-group">
          <label for="juegoPlataforma">Plataforma</label>
          <select id="juegoPlataforma">
            <option value="">Seleccionar plataforma...</option>
          </select>
        </div>
        <div class="form-group">
          <label for="juegoFecha">Fecha Lanzamiento</label>
          <input type="date" id="juegoFecha" value="${juego?.fecha || ""}">
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="juegoImagen">Imagen (URL)</label>
          <input type="text" id="juegoImagen" value="${juego?.imagen || ""}" placeholder="https://ejemplo.com/imagen.jpg">
          <div id="juegoImagenPreview" style="margin-top: 10px; width: 100px; height: 150px; border-radius: 6px; background-size: cover; background-position: center; border: 2px solid #ddd; display: ${juego?.imagen ? "block" : "none"};"></div>
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label><input type="checkbox" id="juegoNuevaConsola" ${juego?.esNuevaConsola ? "checked" : ""}> Es nueva consola</label>
        </div>
      </div>
    `;

    document.getElementById("modalBody").insertBefore(form, jsonInput);

    // Populate plataformas
    const selectPlataforma = document.getElementById("juegoPlataforma");
    currentPlataformas.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nombre;
      if (juego?.plataforma_id == p.id) option.selected = true;
      selectPlataforma.appendChild(option);
    });

    // Preview de imagen
    document.getElementById("juegoImagen").addEventListener("input", (e) => {
      const preview = document.getElementById("juegoImagenPreview");
      const url = e.target.value.trim();
      if (url) {
        preview.style.backgroundImage = `url('${url}')`;
        preview.style.display = "block";
      } else {
        preview.style.display = "none";
      }
    });

    jsonError.style.display = "none";
    addModal.classList.add("active");
  }

  // ============================================================
  // PANEL DE APLICACIONES
  // ============================================================
  function renderAplicacionesPanel(aplicaciones) {
    tableHeaderLine.innerHTML = "";
    tableBody.innerHTML = "";
    if (!aplicaciones || aplicaciones.length === 0) {
      statTotalNumber.textContent = 0;
      tableHeaderLine.innerHTML = "<th>Vacío</th>";
      tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
      return;
    }

    statTotalNumber.textContent = aplicaciones.length;

    const headers = [
      "Imagen",
      "Nombre",
      "Plataforma",
      "Fecha Lanzamiento",
      "Acciones",
    ];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeaderLine.appendChild(th);
    });

    aplicaciones.forEach((app) => {
      const tr = document.createElement("tr");

      // Imagen
      const tdImagen = document.createElement("td");
      tdImagen.classList.add("img-cell");
      tdImagen.innerHTML = `<img src="${app.imagen}" alt="${app.aplicacion}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='./fotos/placeholder.jpg'">`;
      tr.appendChild(tdImagen);

      // Nombre
      const tdNombre = document.createElement("td");
      tdNombre.textContent = app.aplicacion;
      tr.appendChild(tdNombre);

      // Plataforma
      const tdPlataforma = document.createElement("td");
      tdPlataforma.textContent = app.plataforma || "N/A";
      tr.appendChild(tdPlataforma);

      // Fecha
      const tdFecha = document.createElement("td");
      tdFecha.textContent = app.fecha || "N/A";
      tr.appendChild(tdFecha);

      // Acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "5px";

      const btnEdit = document.createElement("button");
      btnEdit.className = "primary-btn";
      btnEdit.style.padding = "5px 10px";
      btnEdit.style.fontSize = "12px";
      btnEdit.innerHTML = '<i class="fa-solid fa-edit"></i> Editar';
      btnEdit.onclick = () => openAplicacionModal(app);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.fontSize = "12px";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      btnDelete.onclick = () => deleteItem(app.id, false);

      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);

      tableBody.appendChild(tr);
    });
  }

  let editingAplicacionId = null;

  function openAplicacionModal(app = null) {
    editingAplicacionId = app ? app.id : null;
    document.getElementById("modalTitle").textContent = app
      ? "Editar Aplicación"
      : "Nueva Aplicación";

    jsonInput.style.display = "none";
    const formContainer = document.getElementById("aplicacionFormContainer");
    if (formContainer) formContainer.remove();

    const form = document.createElement("div");
    form.id = "aplicacionFormContainer";
    form.className = "form-container";
    form.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label for="aplicacionNombre">Nombre</label>
          <input type="text" id="aplicacionNombre" value="${app?.aplicacion || ""}" placeholder="Nombre de la aplicación">
        </div>
        <div class="form-group">
          <label for="aplicacionPlataforma">Plataforma</label>
          <select id="aplicacionPlataforma">
            <option value="">Seleccionar plataforma...</option>
          </select>
        </div>
        <div class="form-group">
          <label for="aplicacionFecha">Fecha Lanzamiento</label>
          <input type="date" id="aplicacionFecha" value="${app?.fecha || ""}">
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="aplicacionImagen">Imagen (URL)</label>
          <input type="text" id="aplicacionImagen" value="${app?.imagen || ""}" placeholder="https://ejemplo.com/imagen.jpg">
          <div id="aplicacionImagenPreview" style="margin-top: 10px; width: 100px; height: 100px; border-radius: 6px; background-size: cover; background-position: center; border: 2px solid #ddd; display: ${app?.imagen ? "block" : "none"};"></div>
        </div>
      </div>
    `;

    document.getElementById("modalBody").insertBefore(form, jsonInput);

    // Populate plataformas
    const selectPlataforma = document.getElementById("aplicacionPlataforma");
    currentPlataformas.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nombre;
      if (app?.plataforma_id == p.id) option.selected = true;
      selectPlataforma.appendChild(option);
    });

    // Preview de imagen
    document
      .getElementById("aplicacionImagen")
      .addEventListener("input", (e) => {
        const preview = document.getElementById("aplicacionImagenPreview");
        const url = e.target.value.trim();
        if (url) {
          preview.style.backgroundImage = `url('${url}')`;
          preview.style.display = "block";
        } else {
          preview.style.display = "none";
        }
      });

    jsonError.style.display = "none";
    addModal.classList.add("active");
  }

  // ============================================================
  // PANEL DE CARROUSEL
  // ============================================================
  function renderCarrouselPanel(items) {
    tableHeaderLine.innerHTML = "";
    tableBody.innerHTML = "";
    if (!items || items.length === 0) {
      statTotalNumber.textContent = 0;
      tableHeaderLine.innerHTML = "<th>Vacío</th>";
      tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
      return;
    }

    statTotalNumber.textContent = items.length;

    const headers = ["Imagen", "Título", "Botón", "Orden", "Acciones"];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeaderLine.appendChild(th);
    });

    items.forEach((item, index) => {
      const tr = document.createElement("tr");

      // Imagen
      const tdImagen = document.createElement("td");
      tdImagen.classList.add("img-cell");
      const url = item.url || item.url_imagen;
      tdImagen.innerHTML = `<img src="${url}" alt="${item.titulo}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='./fotos/placeholder.jpg'">`;
      tr.appendChild(tdImagen);

      // Título
      const tdTitulo = document.createElement("td");
      tdTitulo.textContent = item.titulo;
      tr.appendChild(tdTitulo);

      // Botón
      const tdBoton = document.createElement("td");
      tdBoton.textContent = item.boton_texto || "N/A";
      tr.appendChild(tdBoton);

      // Orden
      const tdOrden = document.createElement("td");
      tdOrden.innerHTML = `<span style="background-color: #e0e7ff; color: #4f46e5; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${item.orden || index + 1}</span>`;
      tr.appendChild(tdOrden);

      // Acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "5px";

      const btnEdit = document.createElement("button");
      btnEdit.className = "primary-btn";
      btnEdit.style.padding = "5px 10px";
      btnEdit.style.fontSize = "12px";
      btnEdit.innerHTML = '<i class="fa-solid fa-edit"></i> Editar';
      btnEdit.onclick = () => openCarrouselModal(item);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.fontSize = "12px";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      btnDelete.onclick = () => deleteItem(item.id, false);

      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);

      tableBody.appendChild(tr);
    });
  }

  let editingCarrouselId = null;

  function openCarrouselModal(item = null) {
    editingCarrouselId = item ? item.id : null;
    document.getElementById("modalTitle").textContent = item
      ? "Editar Elemento Carrousel"
      : "Nuevo Elemento Carrousel";

    jsonInput.style.display = "none";
    const formContainer = document.getElementById("carrouselFormContainer");
    if (formContainer) formContainer.remove();

    const form = document.createElement("div");
    form.id = "carrouselFormContainer";
    form.className = "form-container";
    form.innerHTML = `
      <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="carrouselImagen">Imagen (URL)</label>
          <input type="text" id="carrouselImagen" value="${item?.url_imagen || item?.url || ""}" placeholder="https://ejemplo.com/imagen.jpg">
          <div id="carrouselImagenPreview" style="margin-top: 10px; width: 100%; height: 120px; border-radius: 6px; background-size: cover; background-position: center; border: 2px solid #ddd; display: ${item?.url_imagen || item?.url ? "block" : "none"};"></div>
        </div>
        <div class="form-group">
          <label for="carrouselAlt">Texto Alt</label>
          <input type="text" id="carrouselAlt" value="${item?.alt || ""}" placeholder="Descripción alternativa">
        </div>
        <div class="form-group">
          <label for="carrouselTitulo">Título</label>
          <input type="text" id="carrouselTitulo" value="${item?.titulo || ""}" placeholder="Título del elemento">
        </div>
        <div class="form-group">
          <label for="carrouselBoton">Texto Botón</label>
          <input type="text" id="carrouselBoton" value="${item?.boton_texto || ""}" placeholder="Texto del botón">
        </div>
        <div class="form-group">
          <label for="carrouselLink">Link</label>
          <input type="url" id="carrouselLink" value="${item?.link || ""}" placeholder="https://ejemplo.com">
        </div>
        <div class="form-group">
          <label for="carrouselOrden">Orden</label>
          <input type="number" id="carrouselOrden" value="${item?.orden || "0"}" min="0">
        </div>
      </div>
    `;

    document.getElementById("modalBody").insertBefore(form, jsonInput);

    // Preview de imagen
    document
      .getElementById("carrouselImagen")
      .addEventListener("input", (e) => {
        const preview = document.getElementById("carrouselImagenPreview");
        const url = e.target.value.trim();
        if (url) {
          preview.style.backgroundImage = `url('${url}')`;
          preview.style.display = "block";
        } else {
          preview.style.display = "none";
        }
      });

    jsonError.style.display = "none";
    addModal.classList.add("active");
  }

  // ============================================================
  // PANEL DE TIENDA (MY NINTENDO STORE)
  // ============================================================
  function renderTiendaPanel(items) {
    tableHeaderLine.innerHTML = "";
    tableBody.innerHTML = "";
    if (!items || items.length === 0) {
      statTotalNumber.textContent = 0;
      tableHeaderLine.innerHTML = "<th>Vacío</th>";
      tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
      return;
    }

    statTotalNumber.textContent = items.length;

    const headers = ["Imagen", "Nombre", "Descripción", "Acciones"];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeaderLine.appendChild(th);
    });

    items.forEach((item) => {
      const tr = document.createElement("tr");

      // Imagen
      const tdImagen = document.createElement("td");
      tdImagen.classList.add("img-cell");
      tdImagen.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='./fotos/placeholder.jpg'">`;
      tr.appendChild(tdImagen);

      // Nombre
      const tdNombre = document.createElement("td");
      tdNombre.textContent = item.nombre;
      tr.appendChild(tdNombre);

      // Descripción (truncada)
      const tdDesc = document.createElement("td");
      const desc = item.descripcion || "";
      tdDesc.textContent =
        desc.substring(0, 50) + (desc.length > 50 ? "..." : "");
      tr.appendChild(tdDesc);

      // Acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "5px";

      const btnEdit = document.createElement("button");
      btnEdit.className = "primary-btn";
      btnEdit.style.padding = "5px 10px";
      btnEdit.style.fontSize = "12px";
      btnEdit.innerHTML = '<i class="fa-solid fa-edit"></i> Editar';
      btnEdit.onclick = () => openTiendaModal(item);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.fontSize = "12px";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      btnDelete.onclick = () => deleteItem(item.id, false);

      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);

      tableBody.appendChild(tr);
    });
  }

  let editingTiendaId = null;

  function openTiendaModal(item = null) {
    editingTiendaId = item ? item.id : null;
    document.getElementById("modalTitle").textContent = item
      ? "Editar Producto Tienda"
      : "Nuevo Producto Tienda";

    jsonInput.style.display = "none";
    const formContainer = document.getElementById("tiendaFormContainer");
    if (formContainer) formContainer.remove();

    const form = document.createElement("div");
    form.id = "tiendaFormContainer";
    form.className = "form-container";
    form.innerHTML = `
      <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="tiendaNombre">Nombre</label>
          <input type="text" id="tiendaNombre" value="${item?.nombre || ""}" placeholder="Nombre del producto">
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="tiendaDescripcion">Descripción</label>
          <textarea id="tiendaDescripcion" rows="4" placeholder="Descripción detallada del producto">${item?.descripcion || ""}</textarea>
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="tiendaImagen">Imagen (URL)</label>
          <input type="text" id="tiendaImagen" value="${item?.imagen || ""}" placeholder="https://ejemplo.com/imagen.jpg">
          <div id="tiendaImagenPreview" style="margin-top: 10px; width: 100px; height: 100px; border-radius: 6px; background-size: cover; background-position: center; border: 2px solid #ddd; display: ${item?.imagen ? "block" : "none"};"></div>
        </div>
      </div>
    `;

    document.getElementById("modalBody").insertBefore(form, jsonInput);

    // Preview de imagen
    document.getElementById("tiendaImagen").addEventListener("input", (e) => {
      const preview = document.getElementById("tiendaImagenPreview");
      const url = e.target.value.trim();
      if (url) {
        preview.style.backgroundImage = `url('${url}')`;
        preview.style.display = "block";
      } else {
        preview.style.display = "none";
      }
    });

    jsonError.style.display = "none";
    addModal.classList.add("active");
  }

  // ============================================================
  // PANEL DE NOTICIAS
  // ============================================================
  function renderNoticiasPanel(noticias) {
    tableHeaderLine.innerHTML = "";
    tableBody.innerHTML = "";
    if (!noticias || noticias.length === 0) {
      statTotalNumber.textContent = 0;
      tableHeaderLine.innerHTML = "<th>Vacío</th>";
      tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
      return;
    }

    statTotalNumber.textContent = noticias.length;

    const headers = [
      "Imagen",
      "Título",
      "Etiqueta",
      "Fecha",
      "Link",
      "Acciones",
    ];
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeaderLine.appendChild(th);
    });

    noticias.forEach((noticia) => {
      const tr = document.createElement("tr");

      // Imagen
      const tdImagen = document.createElement("td");
      tdImagen.classList.add("img-cell");
      tdImagen.innerHTML = `<img src="${noticia.imagen}" alt="${noticia.titulo}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='./fotos/placeholder.jpg'">`;
      tr.appendChild(tdImagen);

      // Título
      const tdTitulo = document.createElement("td");
      tdTitulo.textContent = noticia.titulo;
      tr.appendChild(tdTitulo);

      // Etiqueta
      const tdEtiqueta = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "badge badge-info";
      badge.textContent = noticia.etiqueta || "N/A";
      tdEtiqueta.appendChild(badge);
      tr.appendChild(tdEtiqueta);

      // Fecha
      const tdFecha = document.createElement("td");
      tdFecha.textContent = noticia.fecha || "N/A";
      tr.appendChild(tdFecha);

      // Link
      const tdLink = document.createElement("td");
      if (noticia.link && noticia.link !== "#") {
        tdLink.innerHTML = `<a href="${noticia.link}" target="_blank" title="${noticia.link}" style="color: #0066cc; text-decoration: underline; cursor: pointer;">Ver</a>`;
      } else {
        tdLink.textContent = "N/A";
      }
      tr.appendChild(tdLink);

      // Acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "5px";

      const btnEdit = document.createElement("button");
      btnEdit.className = "primary-btn";
      btnEdit.style.padding = "5px 10px";
      btnEdit.style.fontSize = "12px";
      btnEdit.innerHTML = '<i class="fa-solid fa-edit"></i> Editar';
      btnEdit.onclick = () => openNoticiaModal(noticia);

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.fontSize = "12px";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      btnDelete.onclick = () => deleteItem(noticia.id, false);

      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);

      tableBody.appendChild(tr);
    });
  }

  let editingNoticiaId = null;

  function openNoticiaModal(noticia = null) {
    editingNoticiaId = noticia ? noticia.id : null;
    document.getElementById("modalTitle").textContent = noticia
      ? "Editar Noticia"
      : "Nueva Noticia";

    jsonInput.style.display = "none";
    const formContainer = document.getElementById("noticiaFormContainer");
    if (formContainer) formContainer.remove();

    const form = document.createElement("div");
    form.id = "noticiaFormContainer";
    form.className = "form-container";
    form.innerHTML = `
      <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="noticiaTitulo">Título</label>
          <input type="text" id="noticiaTitulo" value="${noticia?.titulo || ""}" placeholder="Título de la noticia">
        </div>
        <div class="form-group">
          <label for="noticiaEtiqueta">Etiqueta</label>
          <select id="noticiaEtiqueta">
            <option value="">Seleccionar etiqueta...</option>
          </select>
        </div>
        <div class="form-group">
          <label for="noticiaFecha">Fecha</label>
          <input type="date" id="noticiaFecha" value="${noticia?.fecha || ""}">
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="noticiaImagen">Imagen (URL)</label>
          <input type="text" id="noticiaImagen" value="${noticia?.imagen || ""}" placeholder="https://ejemplo.com/imagen.jpg">
          <div id="noticiaImagenPreview" style="margin-top: 10px; width: 150px; height: 90px; border-radius: 6px; background-size: cover; background-position: center; border: 2px solid #ddd; display: ${noticia?.imagen ? "block" : "none"};"></div>
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label for="noticiaLink">Link</label>
          <input type="url" id="noticiaLink" value="${noticia?.link || "#"}" placeholder="https://ejemplo.com">
        </div>
      </div>
    `;

    document.getElementById("modalBody").insertBefore(form, jsonInput);

    // Populate etiquetas
    const selectEtiqueta = document.getElementById("noticiaEtiqueta");
    currentEtiquetas.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag.nombre;
      option.textContent = tag.nombre;
      if (noticia?.etiqueta === tag.nombre) option.selected = true;
      selectEtiqueta.appendChild(option);
    });

    // Preview de imagen
    document.getElementById("noticiaImagen").addEventListener("input", (e) => {
      const preview = document.getElementById("noticiaImagenPreview");
      const url = e.target.value.trim();
      if (url) {
        preview.style.backgroundImage = `url('${url}')`;
        preview.style.display = "block";
      } else {
        preview.style.display = "none";
      }
    });

    jsonError.style.display = "none";
    addModal.classList.add("active");
  }

  // ============================================================
  // TABLA GENÉRICA
  // ============================================================
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
          (valor.includes(".jpg") ||
            valor.includes(".png") ||
            valor.includes("http"))
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
    jsonInput.style.display = "block";
    const form = document.getElementById("usuarioFormContainer");
    if (form) form.remove();
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
      alert("Para eliminar una novedad secundaria, usa el editor del panel.");
      return;
    }
    fetch(url, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchData(currentEndpoint))
      .catch((err) => alert("Error al eliminar: " + err.message));
  }

  addNewBtn.addEventListener("click", () => {
    if (currentEndpoint === "usuarios") {
      openUsuarioModal(null);
    } else if (currentEndpoint === "juegos") {
      openJuegoModal(null);
    } else if (currentEndpoint === "aplicaciones") {
      openAplicacionModal(null);
    } else if (currentEndpoint === "carrousel") {
      openCarrouselModal(null);
    } else if (currentEndpoint === "myNintendoStore") {
      openTiendaModal(null);
    } else if (currentEndpoint === "noticias") {
      openNoticiaModal(null);
    } else if (currentEndpoint === "novedades") {
      alert("Usa el editor de novedades para guardar el objeto completo.");
      return;
    } else {
      editingId = null;
      document.getElementById("modalTitle").textContent =
        "Añadir Nuevo Elemento";
      jsonInput.style.display = "block";

      // Limpiar forms dinámicos
      const formIds = [
        "usuarioFormContainer",
        "juegoFormContainer",
        "aplicacionFormContainer",
        "carrouselFormContainer",
        "tiendaFormContainer",
        "noticiaFormContainer",
      ];
      formIds.forEach((id) => {
        const form = document.getElementById(id);
        if (form) form.remove();
      });

      jsonInput.value = "";
      jsonError.style.display = "none";
      let placeholderObj = {};
      if (currentData && currentData.length > 0) {
        const { id, ...rest } = currentData[0];
        placeholderObj = rest;
        jsonInput.value = JSON.stringify(placeholderObj, null, 2);
      }
      addModal.classList.add("active");
    }
  });

  saveBtn.addEventListener("click", () => {
    if (currentEndpoint === "usuarios") {
      // Guardar usuario desde form
      const nombre = document.getElementById("usuarioNombre")?.value.trim();
      const email = document.getElementById("usuarioEmail")?.value.trim();
      const password = document.getElementById("usuarioPassword")?.value.trim();
      const rol = document.getElementById("usuarioRol")?.value;
      const estado = document.getElementById("usuarioEstado")?.value;
      const avatar = document.getElementById("usuarioAvatar")?.value.trim();

      if (!nombre || !email || !password) {
        jsonError.style.display = "block";
        jsonError.textContent = "Nombre, email y password son obligatorios";
        return;
      }

      const userData = {
        nombre,
        email,
        password,
        rol,
        estado,
        avatar,
      };

      let url = "/api/usuarios";
      let method = "POST";
      if (editingUsuarioId !== null) {
        url = `/api/usuarios/${editingUsuarioId}`;
        method = "PUT";
      }

      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then(() => {
          addModal.classList.remove("active");
          const form = document.getElementById("usuarioFormContainer");
          if (form) form.remove();
          fetchData("usuarios");
        })
        .catch((err) => {
          jsonError.style.display = "block";
          jsonError.textContent = "Error: " + err.message;
        });
    } else if (currentEndpoint === "juegos") {
      const titulo = document.getElementById("juegoTitulo")?.value.trim();
      const plataforma_id = document.getElementById("juegoPlataforma")?.value;
      const fecha_lanzamiento = document.getElementById("juegoFecha")?.value;
      const imagen = document.getElementById("juegoImagen")?.value.trim();
      const precio = document.getElementById("juegoPrecio")?.value;
      const esNuevaConsola = document.getElementById("juegoNuevaConsola")
        ?.checked
        ? 1
        : 0;

      if (!titulo) {
        jsonError.style.display = "block";
        jsonError.textContent = "El título es obligatorio";
        return;
      }

      const juegoData = {
        titulo,
        plataforma_id: plataforma_id || null,
        fecha_lanzamiento,
        imagen,
        precio,
        esNuevaConsola,
      };

      let url = "/api/juegos";
      let method = "POST";
      if (editingJuegoId !== null) {
        url = `/api/juegos/${editingJuegoId}`;
        method = "PUT";
      }

      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(juegoData),
      })
        .then((res) => res.json())
        .then(() => {
          addModal.classList.remove("active");
          const form = document.getElementById("juegoFormContainer");
          if (form) form.remove();
          fetchData("juegos");
        })
        .catch((err) => {
          jsonError.style.display = "block";
          jsonError.textContent = "Error: " + err.message;
        });
    } else if (currentEndpoint === "aplicaciones") {
      const nombre = document.getElementById("aplicacionNombre")?.value.trim();
      const plataforma_id = document.getElementById(
        "aplicacionPlataforma",
      )?.value;
      const fecha_lanzamiento =
        document.getElementById("aplicacionFecha")?.value;
      const imagen = document.getElementById("aplicacionImagen")?.value.trim();

      if (!nombre) {
        jsonError.style.display = "block";
        jsonError.textContent = "El nombre es obligatorio";
        return;
      }

      const appData = {
        nombre,
        plataforma_id: plataforma_id || null,
        fecha_lanzamiento,
        imagen,
      };

      let url = "/api/aplicaciones";
      let method = "POST";
      if (editingAplicacionId !== null) {
        url = `/api/aplicaciones/${editingAplicacionId}`;
        method = "PUT";
      }

      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appData),
      })
        .then((res) => res.json())
        .then(() => {
          addModal.classList.remove("active");
          const form = document.getElementById("aplicacionFormContainer");
          if (form) form.remove();
          fetchData("aplicaciones");
        })
        .catch((err) => {
          jsonError.style.display = "block";
          jsonError.textContent = "Error: " + err.message;
        });
    } else if (currentEndpoint === "carrousel") {
      const url_imagen = document
        .getElementById("carrouselImagen")
        ?.value.trim();
      const alt = document.getElementById("carrouselAlt")?.value.trim();
      const titulo = document.getElementById("carrouselTitulo")?.value.trim();
      const boton_texto = document
        .getElementById("carrouselBoton")
        ?.value.trim();
      const link = document.getElementById("carrouselLink")?.value.trim();
      const orden = document.getElementById("carrouselOrden")?.value || 0;

      if (!url_imagen || !titulo) {
        jsonError.style.display = "block";
        jsonError.textContent = "Imagen y título son obligatorios";
        return;
      }

      const carrouselData = {
        url_imagen,
        alt,
        titulo,
        boton_texto,
        link,
        orden,
      };

      let url = "/api/carrousel";
      let method = "POST";
      if (editingCarrouselId !== null) {
        url = `/api/carrousel/${editingCarrouselId}`;
        method = "PUT";
      }

      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carrouselData),
      })
        .then((res) => res.json())
        .then(() => {
          addModal.classList.remove("active");
          const form = document.getElementById("carrouselFormContainer");
          if (form) form.remove();
          fetchData("carrousel");
        })
        .catch((err) => {
          jsonError.style.display = "block";
          jsonError.textContent = "Error: " + err.message;
        });
    } else if (currentEndpoint === "myNintendoStore") {
      const nombre = document.getElementById("tiendaNombre")?.value.trim();
      const descripcion = document
        .getElementById("tiendaDescripcion")
        ?.value.trim();
      const imagen = document.getElementById("tiendaImagen")?.value.trim();

      if (!nombre) {
        jsonError.style.display = "block";
        jsonError.textContent = "El nombre es obligatorio";
        return;
      }

      const tiendaData = {
        nombre,
        descripcion,
        imagen,
      };

      let url = "/api/myNintendoStore";
      let method = "POST";
      if (editingTiendaId !== null) {
        url = `/api/myNintendoStore/${editingTiendaId}`;
        method = "PUT";
      }

      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tiendaData),
      })
        .then((res) => res.json())
        .then(() => {
          addModal.classList.remove("active");
          const form = document.getElementById("tiendaFormContainer");
          if (form) form.remove();
          fetchData("myNintendoStore");
        })
        .catch((err) => {
          jsonError.style.display = "block";
          jsonError.textContent = "Error: " + err.message;
        });
    } else if (currentEndpoint === "noticias") {
      const titulo = document.getElementById("noticiaTitulo")?.value.trim();
      const etiqueta = document.getElementById("noticiaEtiqueta")?.value.trim();
      const fecha = document.getElementById("noticiaFecha")?.value;
      const imagen = document.getElementById("noticiaImagen")?.value.trim();
      const link = document.getElementById("noticiaLink")?.value.trim();

      if (!titulo || !imagen) {
        jsonError.style.display = "block";
        jsonError.textContent = "Título e imagen son obligatorios";
        return;
      }

      const noticiaData = {
        titulo,
        etiqueta,
        fecha,
        imagen,
        link,
      };

      let url = "/api/noticias";
      let method = "POST";
      if (editingNoticiaId !== null) {
        url = `/api/noticias/${editingNoticiaId}`;
        method = "PUT";
      }

      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticiaData),
      })
        .then((res) => res.json())
        .then(() => {
          addModal.classList.remove("active");
          const form = document.getElementById("noticiaFormContainer");
          if (form) form.remove();
          fetchData("noticias");
        })
        .catch((err) => {
          jsonError.style.display = "block";
          jsonError.textContent = "Error: " + err.message;
        });
    } else if (currentEndpoint === "novedades") {
      alert("Usa el editor de novedades para guardar.");
      return;
    } else {
      // Tabla genérica JSON
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
    }
  });

  // ============================================================
  // EDITOR VISUAL DE NOVEDADES
  // ============================================================
  function renderNovedadesEditor(data) {
    if (!novedadesEditor) return;
    const safeData = data || {
      principal: {},
      secundarias: [],
      otrasNoticias: [],
    };
    currentData = safeData;

    if (principalImagen) {
      principalImagen.value = safeData.principal?.imagen || "";
      principalImagen.addEventListener("input", updatePrincipalPreview);
    }

    if (principalEtiqueta) {
      // Llenar select de etiquetas
      principalEtiqueta.innerHTML =
        "<option value=''>Seleccionar etiqueta...</option>";
      currentEtiquetas.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.nombre;
        option.textContent = tag.nombre;
        if (tag.nombre === safeData.principal?.etiqueta) option.selected = true;
        principalEtiqueta.appendChild(option);
      });
    }

    if (principalTitulo)
      principalTitulo.value = safeData.principal?.titulo || "";
    if (principalDescripcion)
      principalDescripcion.value = safeData.principal?.descripcion || "";

    renderSecundariasList(safeData.secundarias || []);
    if (novedadesJsonError) novedadesJsonError.style.display = "none";

    // Render preview principal
    updatePrincipalPreview();
  }

  function updatePrincipalPreview() {
    const preview = document.getElementById("principalImagenPreview");
    if (preview && principalImagen && principalImagen.value.trim()) {
      preview.style.backgroundImage = `url('${principalImagen.value.trim()}')`;
      preview.style.display = "block";
    } else if (preview) {
      preview.style.display = "none";
    }
  }

  function renderSecundariasList(items) {
    if (!secundariasList) return;
    const cards = [...items];
    secundariasList.innerHTML = "";

    cards.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "novedades-item";
      card.innerHTML = `
        <div class="item-header">
          <span>Tarjeta ${index + 1}</span>
          <div class="item-controls">
            <button type="button" class="btn-reorder btn-up" title="Mover arriba" ${index === 0 ? "disabled" : ""}>
              <i class="fa-solid fa-arrow-up"></i>
            </button>
            <button type="button" class="btn-reorder btn-down" title="Mover abajo" ${index === cards.length - 1 ? "disabled" : ""}>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <button type="button" class="btn-danger btn-delete-secundaria" title="Eliminar">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="field-grid">
          <div class="field-group">
            <label>Ruta de imagen</label>
            <input type="text" data-key="imagen" placeholder="./fotos/ejemplo.jpg" value="${item.imagen || ""}">
            <div class="image-preview-small" style="margin-top: 8px; width: 100px; height: 60px; border-radius: 8px; background-size: cover; background-position: center; border: 1px solid #ddd;"></div>
          </div>
          <div class="field-group">
            <label>Tipo de Sección</label>
            <select data-key="etiqueta">
              <option value="">Seleccionar etiqueta...</option>
            </select>
          </div>
          <div class="field-group" style="grid-column: 1 / -1;">
            <label>Título</label>
            <input type="text" data-key="titulo" placeholder="Título" value="${item.titulo || ""}">
          </div>
        </div>
      `;

      // Populate select
      const select = card.querySelector("select[data-key='etiqueta']");
      currentEtiquetas.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.nombre;
        option.textContent = tag.nombre;
        if (tag.nombre === item.etiqueta) option.selected = true;
        select.appendChild(option);
      });

      // Event listeners
      const inputs = card.querySelectorAll("input, select");
      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          currentData.secundarias[index][input.dataset.key] = input.value;
          if (input.dataset.key === "imagen") {
            const preview = card.querySelector(".image-preview-small");
            if (input.value.trim()) {
              preview.style.backgroundImage = `url('${input.value.trim()}')`;
            } else {
              preview.style.backgroundImage = "none";
            }
          }
        });
      });

      // Botones de reordenamiento
      card.querySelector(".btn-up").addEventListener("click", () => {
        if (index > 0) {
          [currentData.secundarias[index], currentData.secundarias[index - 1]] =
            [
              currentData.secundarias[index - 1],
              currentData.secundarias[index],
            ];
          renderSecundariasList(currentData.secundarias);
        }
      });

      card.querySelector(".btn-down").addEventListener("click", () => {
        if (index < currentData.secundarias.length - 1) {
          [currentData.secundarias[index], currentData.secundarias[index + 1]] =
            [
              currentData.secundarias[index + 1],
              currentData.secundarias[index],
            ];
          renderSecundariasList(currentData.secundarias);
        }
      });

      // Botón eliminar
      card
        .querySelector(".btn-delete-secundaria")
        .addEventListener("click", () => {
          if (confirm("¿Eliminar esta tarjeta?")) {
            currentData.secundarias.splice(index, 1);
            renderSecundariasList(currentData.secundarias);
          }
        });

      secundariasList.appendChild(card);
    });

    // Botón añadir secundaria
    const btnAddSecundaria = document.createElement("button");
    btnAddSecundaria.type = "button";
    btnAddSecundaria.className = "secondary-btn";
    btnAddSecundaria.style.marginTop = "16px";
    btnAddSecundaria.innerHTML =
      '<i class="fa-solid fa-plus"></i> Añadir Tarjeta Secundaria';
    btnAddSecundaria.addEventListener("click", () => {
      currentData.secundarias.push({ imagen: "", etiqueta: "", titulo: "" });
      renderSecundariasList(currentData.secundarias);
    });
    secundariasList.appendChild(btnAddSecundaria);
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
    };
  }

  function showNovedadesEditor(show) {
    if (!novedadesEditor) return;
    novedadesEditor.classList.toggle("hidden", !show);
    document.getElementById("tableContainer").classList.toggle("hidden", show);
    addNewBtn.style.display = show ? "none" : "inline-flex";
    if (!show) {
      if (novedadesJsonError) novedadesJsonError.style.display = "none";
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
        if (novedadesJsonError) {
          novedadesJsonError.textContent = err.message;
          novedadesJsonError.style.display = "block";
        }
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
      pageTitle.textContent =
        "Gestión de " + link.querySelector("span").textContent;
      fetchData(currentEndpoint);
    });
  });

  // Búsqueda frontend
  searchInput.addEventListener("input", (e) => {
    if (currentEndpoint === "novedades") return;
    const val = e.target.value.toLowerCase();
    if (!val) {
      if (currentEndpoint === "usuarios") {
        renderUsuariosPanel(currentData);
      } else if (currentEndpoint === "juegos") {
        renderJuegosPanel(currentData);
      } else if (currentEndpoint === "aplicaciones") {
        renderAplicacionesPanel(currentData);
      } else if (currentEndpoint === "carrousel") {
        renderCarrouselPanel(currentData);
      } else if (currentEndpoint === "myNintendoStore") {
        renderTiendaPanel(currentData);
      } else if (currentEndpoint === "noticias") {
        renderNoticiasPanel(currentData);
      } else {
        renderTable(currentData, false);
      }
      return;
    }
    const filtered = currentData.filter((item) =>
      Object.values(item).some((v) => String(v).toLowerCase().includes(val)),
    );
    if (currentEndpoint === "usuarios") {
      renderUsuariosPanel(filtered);
    } else if (currentEndpoint === "juegos") {
      renderJuegosPanel(filtered);
    } else if (currentEndpoint === "aplicaciones") {
      renderAplicacionesPanel(filtered);
    } else if (currentEndpoint === "carrousel") {
      renderCarrouselPanel(filtered);
    } else if (currentEndpoint === "myNintendoStore") {
      renderTiendaPanel(filtered);
    } else if (currentEndpoint === "noticias") {
      renderNoticiasPanel(filtered);
    } else {
      renderTable(filtered, false);
    }
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      addModal.classList.remove("active");
      // Limpiar todos los forms dinámicos
      const formIds = [
        "usuarioFormContainer",
        "juegoFormContainer",
        "aplicacionFormContainer",
        "carrouselFormContainer",
        "tiendaFormContainer",
        "noticiaFormContainer",
      ];
      formIds.forEach((id) => {
        const form = document.getElementById(id);
        if (form) form.remove();
      });
      jsonInput.style.display = "block";
    });
  });

  // Modal backdrop click
  addModal.addEventListener("click", (e) => {
    if (e.target === addModal) {
      addModal.classList.remove("active");
      // Limpiar todos los forms dinámicos
      const formIds = [
        "usuarioFormContainer",
        "juegoFormContainer",
        "aplicacionFormContainer",
        "carrouselFormContainer",
        "tiendaFormContainer",
        "noticiaFormContainer",
      ];
      formIds.forEach((id) => {
        const form = document.getElementById(id);
        if (form) form.remove();
      });
      jsonInput.style.display = "block";
    }
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

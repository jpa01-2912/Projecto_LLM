document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links li");
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

  let currentEndpoint = "usuarios";
  let currentData = [];

  const novedadesEditor = document.getElementById("novedadesEditor");
  const principalImagen = document.getElementById("principalImagen");
  const principalEtiqueta = document.getElementById("principalEtiqueta");
  const principalTitulo = document.getElementById("principalTitulo");
  const principalDescripcion = document.getElementById("principalDescripcion");
  const secundariasList = document.getElementById("secundariasList");
  const saveNovedadesBtn = document.getElementById("saveNovedadesBtn");
  const novedadesJsonError = document.getElementById("novedadesJsonError");

  // Mapeo de endpoint a ruta API real y estructura ejemplo
  const apiMap = {
    usuarios: { url: "/api/usuarios", idField: "id" },
    juegos: { url: "/api/juegos", idField: "id" },
    aplicaciones: { url: "/api/aplicaciones", idField: "id" },
    carrousel: { url: "/api/carrousel", idField: "id" },
    myNintendoStore: { url: "/api/myNintendoStore", idField: "id" },
    novedades: { url: "/api/novedades", idField: null }, // especial
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
          novedadesJsonError.textContent =
            "Error al cargar novedades: " + err.message;
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
      const btnDelete = document.createElement("button");
      btnDelete.className = "btn-danger";
      btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
      // Usamos el id real del objeto, si existe
      const idToDelete = item.id !== undefined ? item.id : idx;
      btnDelete.onclick = () => deleteItem(idToDelete, isNovedades);
      tdAcciones.appendChild(btnDelete);
      tr.appendChild(tdAcciones);
      tableBody.appendChild(tr);
    });
  }

  function deleteItem(idOrIndex, isNovedades) {
    if (!confirm("¿Eliminar permanentemente?")) return;
    const api = apiMap[currentEndpoint];
    if (!api) return;

    let url = `${api.url}/${idOrIndex}`;
    // Para novedades no se puede eliminar un item individual de secundarias con este método simple,
    // necesitarías implementar una lógica especial. Por simplicidad, mostramos un alert.
    if (isNovedades) {
      alert(
        "Para eliminar una novedad secundaria, usa el editor JSON o modifica el backend.",
      );
      return;
    }
    fetch(url, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchData(currentEndpoint))
      .catch((err) => alert("Error al eliminar: " + err.message));
  }

  addNewBtn.addEventListener("click", () => {
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
    fetch(api.url, {
      method: "POST",
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
    const safeData = data || {
      principal: {},
      secundarias: [],
      otrasNoticias: [],
    };
    currentData = safeData;
    if (principalImagen)
      principalImagen.value = safeData.principal?.imagen || "";
    if (principalEtiqueta)
      principalEtiqueta.value = safeData.principal?.etiqueta || "";
    if (principalTitulo)
      principalTitulo.value = safeData.principal?.titulo || "";
    if (principalDescripcion)
      principalDescripcion.value = safeData.principal?.descripcion || "";
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
            <input type="text" value="${item.imagen || ""}" data-key="imagen" placeholder="localhost:3000/fotos/ejemplo.jpg o ./fotos/ejemplo.jpg" />
          </div>
          <div class="field-group">
            <label>Tipo de Sección</label>
            <input type="text" value="${item.etiqueta || ""}" data-key="etiqueta" placeholder="Ej. Juegos, Noticias..." />
          </div>
          <div class="field-group" style="grid-column: 1 / -1;">
            <label>Título</label>
            <input type="text" value="${item.titulo || ""}" data-key="titulo" placeholder="Título de la tarjeta" />
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

  function levenshteinDistance(a, b) {
    const matrix = [];
    const lenA = a.length;
    const lenB = b.length;
    for (let i = 0; i <= lenA; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= lenB; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost,
        );
      }
    }
    return matrix[lenA][lenB];
  }

  function similarityScore(a, b) {
    const textA = String(a || "");
    const textB = String(b || "");
    if (!textA && !textB) return 1;
    if (!textA || !textB) return 0;
    const distance = levenshteinDistance(textA, textB);
    return 1 - distance / Math.max(textA.length, textB.length);
  }

  function compareNovedadesSimilarity(oldData, newData) {
    const report = [];
    const fields = ["imagen", "etiqueta", "titulo", "descripcion"];
    fields.forEach((field) => {
      const oldValue = (oldData.principal && oldData.principal[field]) || "";
      const newValue = (newData.principal && newData.principal[field]) || "";
      const score = similarityScore(oldValue, newValue);
      report.push({
        section: "principal",
        field,
        score: Math.round(score * 100),
      });
    });
    const oldCards = oldData.secundarias || [];
    const newCards = newData.secundarias || [];
    for (let i = 0; i < 4; i++) {
      const oldCard = oldCards[i] || {};
      const newCard = newCards[i] || {};
      ["imagen", "etiqueta", "titulo"].forEach((field) => {
        const oldValue = oldCard[field] || "";
        const newValue = newCard[field] || "";
        const score = similarityScore(oldValue, newValue);
        report.push({
          section: `secundarias[${i}]`,
          field,
          score: Math.round(score * 100),
        });
      });
    }
    return report;
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
    const similarity = compareNovedadesSimilarity(currentData, payload);
    const warnings = similarity.filter((item) => item.score < 90);
    console.info("Similitud de novedades:", similarity);
    if (warnings.length > 0) {
      console.warn("Campos con similitud menor a 90%:", warnings);
    }
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
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("active")) return;
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      currentEndpoint = link.dataset.endpoint;
      pageTitle.textContent =
        "Gestión de " + link.querySelector("span").textContent;
      fetchData(currentEndpoint);
    });
  });

  // Búsqueda frontend (filtra currentData)
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

  // Fetch número de tablas para el Dashboard
  fetch("/api/stats/db")
    .then((res) => res.json())
    .then((data) => {
      if (statDbCount) statDbCount.textContent = `${data.total} Tablas`;
    })
    .catch((err) => console.error("Error cargando tablas:", err));

  // Cargar datos iniciales
  fetchData(currentEndpoint);
});

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

    let currentEndpoint = "usuarios";
    let currentData = [];

    // Mapeo de endpoint a ruta API real y estructura ejemplo
    const apiMap = {
        usuarios: { url: "/api/usuarios", idField: "id" },
        juegos: { url: "/api/juegos", idField: "id" },
        aplicaciones: { url: "/api/aplicaciones", idField: "id" },
        carrousel: { url: "/api/carrousel", idField: "id" },
        myNintendoStore: { url: "/api/myNintendoStore", idField: "id" },
        novedades: { url: "/api/novedades", idField: null } // especial
    };

    function fetchData(endpoint) {
        tableHeaderLine.innerHTML = "<th>Cargando...</th>";
        tableBody.innerHTML = "";
        const api = apiMap[endpoint];
        if (!api) return;

        fetch(api.url)
            .then(res => res.json())
            .then(data => {
                if (endpoint === 'novedades') {
                    // Para novedades, mostramos las secundarias como tabla
                    currentData = data.secundarias || [];
                    renderTable(currentData, true);
                } else {
                    currentData = Array.isArray(data) ? data : [data];
                    renderTable(currentData, false);
                }
            })
            .catch(err => {
                console.error(err);
                tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
            });
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
        headers.forEach(key => {
            const th = document.createElement("th");
            th.textContent = key;
            tableHeaderLine.appendChild(th);
        });
        const thAcciones = document.createElement("th");
        thAcciones.textContent = "Acciones";
        tableHeaderLine.appendChild(thAcciones);

        dataArray.forEach((item, idx) => {
            const tr = document.createElement("tr");
            headers.forEach(key => {
                const td = document.createElement("td");
                let valor = item[key];
                if (key === 'link') {
                    td.innerHTML = `<a href="${valor}" target="_blank" style="color: blue; text-decoration: underline;">${valor}</a>`;
                } else if (typeof valor === 'string' && (valor.includes(".jpg") || valor.includes(".png") || valor.includes("http"))) {
                    td.classList.add("img-cell");
                    td.innerHTML = `<img src="${valor}" alt="preview" onerror="this.src='./fotos/placeholder.jpg'" style="max-width:80px;">`;
                } else if (typeof valor === 'object') {
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
            alert("Para eliminar una novedad secundaria, usa el editor JSON o modifica el backend.");
            return;
        }
        fetch(url, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => fetchData(currentEndpoint))
            .catch(err => alert("Error al eliminar: " + err.message));
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
        const jsonText = jsonInput.value;
        let newObj;
        try {
            newObj = JSON.parse(jsonText);
            jsonError.style.display = "none";
        } catch(e) {
            jsonError.style.display = "block";
            return;
        }
        const api = apiMap[currentEndpoint];
        if (!api) return;
        fetch(api.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newObj)
        })
        .then(res => res.json())
        .then(() => {
            addModal.classList.remove("active");
            fetchData(currentEndpoint);
        })
        .catch(err => alert("Error al guardar: " + err.message));
    });

    // Cambio de pestaña
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (link.classList.contains("active")) return;
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentEndpoint = link.dataset.endpoint;
            pageTitle.textContent = "Gestión de " + link.querySelector("span").textContent;
            fetchData(currentEndpoint);
        });
    });

    // Búsqueda frontend (filtra currentData)
    searchInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        if (!val) {
            renderTable(currentData, currentEndpoint === 'novedades');
            return;
        }
        const filtered = currentData.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(val)));
        renderTable(filtered, currentEndpoint === 'novedades');
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => addModal.classList.remove("active"));
    });

    // Cargar datos iniciales
    fetchData(currentEndpoint);
});
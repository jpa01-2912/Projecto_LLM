document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links li");
    const pageTitle = document.getElementById("pageTitle");
    const searchInput = document.getElementById("searchInput");
    
    // Elements para la Tabla
    const tableHeaderLine = document.getElementById("tableHeaderLine");
    const tableBody = document.getElementById("tableBody");
    
    // Modales y Botones
    const addNewBtn = document.getElementById("addNewBtn");
    const addModal = document.getElementById("addModal");
    const closeButtons = document.querySelectorAll(".close-modal");
    const saveBtn = document.getElementById("saveBtn");
    const jsonInput = document.getElementById("jsonInput");
    const jsonError = document.getElementById("jsonError");
    
    // Stats
    const statTotalNumber = document.getElementById("statTotalNumber");
    
    let currentEndpoint = "usuarios";
    let currentData = [];

    // --- 1. Inicialización ---
    fetchData(currentEndpoint);

    // --- 2. Cambiar de Pestaña ---
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

    // --- 3. Fetch y Renderización ---
    function fetchData(endpoint) {
        tableHeaderLine.innerHTML = "<th>Cargando...</th>";
        tableBody.innerHTML = "";
        
        fetch(`/api/${endpoint}`)
            .then(res => res.json())
            .then(data => {
                // Hay casos donde la respuesta puede ser un objeto un poco distinto (ej: Novedades)
                // Pero intentaremos estandarizar en un array o extraerlo.
                
                if (endpoint === 'novedades') {
                    // Adaptacion para novedades.json que es un objeto con {principal, secundarias, otrasNoticias}
                    // Mostraremos secundarias por defecto en la tabla para que sea un array gestionable.
                    currentData = data.secundarias || [];
                    renderTable(currentData);
                    return;
                }
                
                if (Array.isArray(data)) {
                    currentData = data;
                    renderTable(currentData);
                } else {
                    currentData = [data]; // Lo convertimos en array si es objeto plano
                    renderTable(currentData);
                }
            })
            .catch(err => {
                console.error("Error al cargar:", err);
                tableHeaderLine.innerHTML = "<th>Error cargando datos</th>";
            });
    }

    function renderTable(dataArray) {
        tableHeaderLine.innerHTML = "";
        tableBody.innerHTML = "";

        if (!dataArray || dataArray.length === 0) {
            statTotalNumber.textContent = 0;
            tableHeaderLine.innerHTML = "<th>Vacio</th>";
            tableBody.innerHTML = "<tr><td>No hay registros</td></tr>";
            return;
        }
        
        statTotalNumber.textContent = dataArray.length;

        // 1. Generar Cabeceras basadas en las llaves del primer objeto
        const headers = Object.keys(dataArray[0]);
        headers.forEach(key => {
            const th = document.createElement("th");
            th.textContent = key;
            tableHeaderLine.appendChild(th);
        });
        
        // Columna para Acciones
        const thAcciones = document.createElement("th");
        thAcciones.textContent = "Acciones";
        tableHeaderLine.appendChild(thAcciones);

        // 2. Generar Filas
        dataArray.forEach((item, index) => {
            const tr = document.createElement("tr");

            headers.forEach(key => {
                const td = document.createElement("td");
                let valor = item[key];
                
                // Si la clave tiene "imagen" o "url" y termina en formato de imagen
                if (typeof valor === 'string' && (valor.includes(".jpg") || valor.includes(".png") || valor.includes("http"))) {
                    td.classList.add("img-cell");
                    td.innerHTML = `<img src="${valor}" alt="img preview" onerror="this.src='./fotos/placeholder.jpg'">`;
                } else if (typeof valor === 'object') {
                    td.textContent = JSON.stringify(valor);
                } else {
                    td.textContent = valor;
                }
                
                tr.appendChild(td);
            });

            // Acciones TD
            const tdAcciones = document.createElement("td");
            const btnDelete = document.createElement("button");
            btnDelete.className = "btn-danger";
            btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
            btnDelete.onclick = () => deleteItem(index);
            
            tdAcciones.appendChild(btnDelete);
            tr.appendChild(tdAcciones);
            
            tableBody.appendChild(tr);
        });
    }

    // --- 4. Eliminar Elemento ---
    function deleteItem(index) {
        if (!confirm("¿Estás seguro de que deseas eliminar este elemento?")) return;

        // Por ahora delete backend
        fetch(`/api/${currentEndpoint}/${index}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            fetchData(currentEndpoint); // recargar data
        })
        .catch(err => {
            console.error("Error borrando:", err);
            alert("No se pudo borrar, quiza el endpoint no soporta borrar en este formato especifico (ej Novedades)");
        });
    }

    // --- 5. Lógica del Modal y Añadir ---
    addNewBtn.addEventListener("click", () => {
        jsonInput.value = "";
        jsonError.style.display = "none";
        
        let placeholderObj = {};
        if (currentData && currentData.length > 0) {
            // Generar un placeholder con la misma estructura vacío
            Object.keys(currentData[0]).forEach(k => placeholderObj[k] = "");
            jsonInput.value = JSON.stringify(placeholderObj, null, 2);
        }
        
        addModal.classList.add("active");
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            addModal.classList.remove("active");
        });
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

        // Llamar a POST backend
        fetch(`/api/${currentEndpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newObj)
        })
        .then(res => res.json())
        .then(data => {
            addModal.classList.remove("active");
            fetchData(currentEndpoint);
        })
        .catch(err => {
            alert("Error al guardar.");
            console.error(err);
        });
    });

    // --- 6. Buscador Frontend rápido ---
    searchInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        
        if (!val) {
            renderTable(currentData);
            return;
        }
        
        const filtered = currentData.filter(item => {
            return Object.values(item).some(v => 
                String(v).toLowerCase().includes(val)
            );
        });
        
        renderTable(filtered);
    });
});

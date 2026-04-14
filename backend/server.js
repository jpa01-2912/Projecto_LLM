const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Directorio del frontend (arriba de backend) y carpeta de datos
const dataDir = path.join(__dirname, '..', 'data');
const frontendDir = path.join(__dirname, '..');

// Servir archivos estáticos del frontend
app.use(express.static(frontendDir));

// --- API Endpoints ---

// Ruta genérica para obtener cualquier JSON
app.get('/api/:filename', (req, res) => {
    const filePath = path.join(dataDir, `${req.params.filename}.json`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: "Archivo no encontrado o error al leer." });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta genérica para sobreescribir cualquier JSON (manipular datos)
app.put('/api/:filename', (req, res) => {
    const filePath = path.join(dataDir, `${req.params.filename}.json`);
    const newData = req.body;

    fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: "Error al guardar los datos." });
        }
        res.json({ message: "Datos actualizados correctamente." });
    });
});

// Endpoint para añadir un elemento a un array JSON específico (ej: nuevo juego)
app.post('/api/:filename', (req, res) => {
    const filePath = path.join(dataDir, `${req.params.filename}.json`);
    const newItem = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: "Archivo no encontrado." });
        }
        
        try {
            let jsonArray = JSON.parse(data);
            if (!Array.isArray(jsonArray)) {
                return res.status(400).json({ error: "El archivo JSON no es un arreglo (array)." });
            }
            
            jsonArray.push(newItem);
            
            fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2), 'utf8', (err) => {
                if (err) {
                    return res.status(500).json({ error: "Error al guardar el nuevo elemento." });
                }
                res.status(201).json({ message: "Elemento añadido correctamente.", item: newItem });
            });
        } catch (e) {
            res.status(500).json({ error: "Error procesando el JSON." });
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Backend API escuchando en http://localhost:${PORT}`);
    console.log(`Frontend accesible en http://localhost:${PORT}`);
});

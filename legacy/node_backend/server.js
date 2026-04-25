const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Servir archivos estáticos del frontend (la carpeta raíz del proyecto)
app.use(express.static(path.join(__dirname, "..")));

// Pool de conexiones MySQL
const pool = mysql.createPool({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "",
  database: "tienda",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---------- ENDPOINTS PARA CADA RECURSO ----------

// ---------- USUARIOS ----------
app.get("/api/usuarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, email, password, rol, estado, fecha_registro, avatar } =
      req.body;
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_registro, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        email,
        password,
        rol || "user",
        estado || "activo",
        fecha_registro || new Date().toISOString().split("T")[0],
        avatar,
      ],
    );
    res.status(201).json({ id: result.insertId, message: "Usuario creado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const { nombre, email, password, rol, estado, avatar } = req.body;
    await pool.query(
      "UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, estado=?, avatar=? WHERE id=?",
      [nombre, email, password, rol, estado, avatar, req.params.id],
    );
    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/usuarios/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [req.params.id]);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- JUEGOS (similar para los demás recursos) ----------
app.get("/api/juegos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM juegos ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/juegos", async (req, res) => {
  try {
    const { juego, plataforma, fecha, imagen, esNuevaConsola, precio } =
      req.body;
    const [result] = await pool.query(
      "INSERT INTO juegos (juego, plataforma, fecha, imagen, esNuevaConsola, precio) VALUES (?, ?, ?, ?, ?, ?)",
      [juego, plataforma, fecha, imagen, esNuevaConsola || false, precio],
    );
    res.status(201).json({ id: result.insertId, message: "Juego añadido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/juegos/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM juegos WHERE id = ?", [req.params.id]);
    res.json({ message: "Juego eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- APLICACIONES ----------
app.get("/api/aplicaciones", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM aplicaciones");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/aplicaciones", async (req, res) => {
  try {
    const { aplicacion, plataforma, fecha, imagen } = req.body;
    const [result] = await pool.query(
      "INSERT INTO aplicaciones (aplicacion, plataforma, fecha, imagen) VALUES (?, ?, ?, ?)",
      [aplicacion, plataforma, fecha, imagen],
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/aplicaciones/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM aplicaciones WHERE id = ?", [req.params.id]);
    res.json({ message: "Aplicación eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- CARRUSEL ----------
app.get("/api/carrousel", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM carrousel ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/carrousel", async (req, res) => {
  try {
    const { url, alt, titulo, boton_texto, link } = req.body;
    const [result] = await pool.query(
      "INSERT INTO carrousel (url, alt, titulo, boton_texto, link) VALUES (?, ?, ?, ?, ?)",
      [url, alt, titulo, boton_texto, link],
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/carrousel/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM carrousel WHERE id = ?", [req.params.id]);
    res.json({ message: "Elemento del carrusel eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- MY NINTENDO STORE ----------
app.get("/api/myNintendoStore", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM myNintendoStore");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/myNintendoStore", async (req, res) => {
  try {
    const { aplicacion, descripcion, imagen } = req.body;
    const [result] = await pool.query(
      "INSERT INTO myNintendoStore (aplicacion, descripcion, imagen) VALUES (?, ?, ?)",
      [aplicacion, descripcion, imagen],
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/myNintendoStore/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM myNintendoStore WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Elemento eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- NOVEDADES (estructura especial) ----------
app.get("/api/novedades", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT principal, secundarias, otrasNoticias FROM novedades WHERE id = 1",
    );
    if (rows.length === 0)
      return res.json({ principal: {}, secundarias: [], otrasNoticias: [] });
    const { principal, secundarias, otrasNoticias } = rows[0];
    res.json({
      principal: JSON.parse(principal),
      secundarias: JSON.parse(secundarias),
      otrasNoticias: JSON.parse(otrasNoticias),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar novedades completa o parcial (PUT)
app.put("/api/novedades", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT principal, secundarias, otrasNoticias FROM novedades WHERE id = 1",
    );
    let currentPrincipal = {};
    let currentSecundarias = [];
    let currentOtrasNoticias = [];
    let isNewRecord = false;

    if (rows.length === 0) {
      isNewRecord = true;
    } else {
      const current = rows[0];
      currentPrincipal = JSON.parse(current.principal || "{}");
      currentSecundarias = JSON.parse(current.secundarias || "[]");
      currentOtrasNoticias = JSON.parse(current.otrasNoticias || "[]");
    }



    const incoming = req.body || {};
    const incomingPrincipal = incoming.principal || {};
    const incomingSecundarias = incoming.secundarias;
    const incomingOtrasNoticias = incoming.otrasNoticias;

    const mergedPrincipal = {
      ...currentPrincipal,
      ...Object.fromEntries(
        Object.entries(incomingPrincipal).filter(
          ([, value]) => value !== undefined && value !== null,
        ),
      ),
    };

    const mergedSecundarias = Array.isArray(incomingSecundarias)
      ? incomingSecundarias
      : currentSecundarias;

    const mergedOtrasNoticias = Array.isArray(incomingOtrasNoticias)
      ? incomingOtrasNoticias
      : currentOtrasNoticias;

    if (isNewRecord) {
      await pool.query(
        "INSERT INTO novedades (id, principal, secundarias, otrasNoticias) VALUES (1, ?, ?, ?)",
        [
          JSON.stringify(mergedPrincipal),
          JSON.stringify(mergedSecundarias),
          JSON.stringify(mergedOtrasNoticias),
        ],
      );
    } else {
      await pool.query(
        "UPDATE novedades SET principal = ?, secundarias = ?, otrasNoticias = ? WHERE id = 1",
        [
          JSON.stringify(mergedPrincipal),
          JSON.stringify(mergedSecundarias),
          JSON.stringify(mergedOtrasNoticias),
        ],
      );
    }
    res.json({ message: "Novedades actualizadas" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- ESTADÍSTICAS GLOBALES ----------
app.get("/api/stats/db", async (req, res) => {
  try {
    // "SHOW TABLES" devuelve un array con las tablas de la base de datos conectada ('tienda')
    const [rows] = await pool.query("SHOW TABLES");
    res.json({ total: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Para mantener compatibilidad con el admin (que espera POST para añadir items en secundarias, etc.)
// Pero como novedades tiene una estructura especial, recomendamos manejar la actualización completa.
// Si tu admin.js actual intenta hacer POST /api/novedades, puedes redirigirlo a PUT.
app.post("/api/novedades", async (req, res) => {
  // Redirigimos a la actualización completa (opcional)
  try {
    const current = await pool.query(
      "SELECT principal, secundarias, otrasNoticias FROM novedades WHERE id = 1",
    );
    let { principal, secundarias, otrasNoticias } = current[0][0];
    principal = JSON.parse(principal);
    secundarias = JSON.parse(secundarias);
    otrasNoticias = JSON.parse(otrasNoticias);

    // Según lo que envíe el admin, podrías agregar a secundarias, etc. Pero por simplicidad:
    // Si el body tiene "secundarias", lo reemplazas. Si no, ignoras.
    if (req.body.secundarias) secundarias = req.body.secundarias;
    if (req.body.otrasNoticias) otrasNoticias = req.body.otrasNoticias;

    await pool.query(
      "UPDATE novedades SET principal = ?, secundarias = ?, otrasNoticias = ? WHERE id = 1",
      [
        JSON.stringify(principal),
        JSON.stringify(secundarias),
        JSON.stringify(otrasNoticias),
      ],
    );
    res.json({ message: "Novedades actualizadas vía POST" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Base de datos MySQL conectada correctamente`);
});

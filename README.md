# 🎮 LLM Project 25-26 — Nintendo Store Clone

> Réplica funcional de la tienda oficial de Nintendo, desarrollada como proyecto de fin de curso de **1º DAW**.

**Autores:** Jairo Prats Albal · Gabriela Marinova Todorova · Aarón Martínez López

---

## 📋 Descripción

Aplicación web completa con **frontend, backend y base de datos** que simula el funcionamiento de la tienda online de Nintendo. Incluye catálogo de juegos, carrito de compras, lista de deseos, autenticación de usuarios con roles y un panel de administración completo (Back Office).

---

## 🚀 Instalación y puesta en marcha

### Requisitos previos

- **PHP** (con extensión PDO y PDO_MySQL)
- **MySQL** (se recomienda XAMPP)
- Navegador web moderno

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Projecto_LLM
```

### 2. Importar la base de datos

1. Abre **phpMyAdmin** (o tu cliente MySQL preferido)
2. Crea una base de datos llamada `tienda`
3. Importa el archivo:

```
SQL_Imports/tienda.sql
```

> 💡 En `SQL_Imports/` también encontrarás snapshots de la BD de fechas anteriores por si necesitas una versión específica.

### 3. Arrancar el servidor

Abre una terminal en la **raíz del proyecto** y ejecuta:

```bash
php -S localhost:3000 router.php
```

### 4. Abrir en el navegador

```
http://localhost:3000
```

---

## 🗂️ Estructura del proyecto

```
Projecto_LLM/
│
├── router.php              # Punto de entrada — enruta API y ficheros estáticos
├── .htaccess               # Reglas de reescritura para Apache
│
├── api/
│   ├── index.php           # API RESTful completa (todos los endpoints)
│   └── .htaccess
│
├── public/                 # Frontend (zona pública)
│   ├── index.html          # Página de inicio
│   ├── juegos.html         # Catálogo de juegos
│   ├── carrito.html        # Carrito de compras
│   ├── wishlist.html       # Lista de deseos
│   ├── login.html          # Inicio de sesión
│   ├── register.html       # Registro de cuenta
│   ├── admin.html          # Panel de administración (Back Office)
│   ├── ayuda.html
│   ├── empresa.html
│   ├── empleo.html
│   ├── privacidad.html
│   ├── control-parental.html
│   ├── cambiar-password.html
│   │
│   ├── css/                # Hojas de estilo
│   │   ├── variables.css   # Variables CSS globales (colores, fuentes)
│   │   ├── style.css       # Estilos generales y layout
│   │   ├── juegos.css
│   │   ├── carrito.css
│   │   ├── login.css
│   │   ├── register.css
│   │   ├── admin.css
│   │   └── ...
│   │
│   ├── js/                 # Lógica JavaScript
│   │   ├── api.js          # Capa de comunicación con la API (fetch)
│   │   ├── main.js         # Lógica de la página de inicio
│   │   ├── juegos.js       # Catálogo, filtros y paginación
│   │   ├── carrito.js      # Carrito de compras y códigos descuento
│   │   ├── wishlist.js     # Lista de deseos
│   │   ├── login.js        # Autenticación y sincronización del carrito
│   │   ├── register.js     # Registro con validación de contraseña
│   │   ├── admin.js        # Panel de administración (CRUD)
│   │   ├── auth-ui.js      # Actualización dinámica del topbar según sesión
│   │   ├── carousel.js     # Carrusel automático
│   │   ├── games.js        # Sección de juegos en el índice
│   │   ├── news.js         # Sección de noticias/novedades
│   │   ├── store.js        # Sección MyNintendo Store
│   │   ├── i18n.js         # Internacionalización (login multi-idioma)
│   │   ├── common.js       # Utilidades compartidas
│   │   └── dropdown.js     # Menús desplegables del nav lateral
│   │
│   └── fotos/              # Imágenes del proyecto
│       ├── Juegos/
│       ├── Carrousel/
│       ├── Noticias/
│       ├── Novedades/
│       ├── Aplicaciones/
│       ├── Hardware/
│       ├── MyNintendoStore/
│       └── logos/
│
├── SQL_Imports/            # Dumps de la base de datos
│   ├── tienda.sql          # ⭐ Importación principal
│   └── ...                 # Snapshots de desarrollo
│
└── docs/
    └── tuto.md
```

---

## 🔌 API RESTful — Endpoints

Todos los endpoints responden en **JSON** y aceptan los verbos `GET`, `POST`, `PUT` y `DELETE`.

| Endpoint | Descripción |
|---|---|
| `GET /api/usuarios` | Listado de usuarios |
| `POST /api/usuarios` | Crear usuario |
| `PUT /api/usuarios/{id}` | Editar usuario |
| `DELETE /api/usuarios/{id}` | Eliminar usuario |
| `GET /api/juegos` | Listado de juegos del catálogo |
| `POST /api/juegos` | Añadir juego |
| `PUT /api/juegos/{id}` | Editar juego |
| `DELETE /api/juegos/{id}` | Eliminar juego |
| `GET /api/plataformas` | Listado de plataformas |
| `GET /api/etiquetas` | Listado de etiquetas |
| `GET/POST/PUT/DELETE /api/carrito` | Gestión del carrito de compras |
| `GET/POST/DELETE /api/favoritos` | Gestión de la lista de deseos |
| `GET/POST/PUT/DELETE /api/carrousel` | Gestión del carrusel |
| `GET/POST/PUT/DELETE /api/noticias` | Gestión de noticias |
| `GET/POST/PUT/DELETE /api/novedades` | Gestión de novedades |
| `GET/POST/PUT/DELETE /api/aplicaciones` | Gestión de aplicaciones |
| `GET/POST/PUT/DELETE /api/myNintendoStore` | Gestión de la sección MyNintendo Store |
| `GET /api/stats` | Estadísticas generales |

---

## 🗄️ Base de datos

La base de datos se llama `tienda` y está compuesta por las siguientes tablas:

| Tabla | Descripción |
|---|---|
| `usuarios` | Cuentas de usuario con roles y estados |
| `juegos` | Catálogo de juegos |
| `plataformas` | Nintendo Switch / Nintendo Switch 2 |
| `carrito` | Ítems del carrito por usuario |
| `favoritos` | Lista de deseos por usuario |
| `noticias` | Noticias de la página principal |
| `novedades` | Novedades destacadas y secundarias |
| `carrousel` | Imágenes del carrusel principal |
| `etiquetas` | Etiquetas de clasificación (JUEGOS, NOTICIAS…) |
| `aplicaciones` | Apps para dispositivos inteligentes |
| `mynintendostore` | Ítems de la sección tienda física |

---

## 👤 Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| `admin@nintendo.com` | `Admin1234` | Administrador |
| `mario.jump@mushroom.kr` | `Mario1234` | Usuario |

> El rol `admin` da acceso al panel de administración visible en el topbar tras iniciar sesión.

---

## 🛒 Códigos de descuento

Puedes probarlos en la página del carrito:

| Código | Descuento |
|---|---|
| `codigokonami` | 50% de descuento en el total |
| `retro` | Descuento en todos los juegos de Nintendo Switch (gen 1) |

---

## ✨ Funcionalidades principales

### Front Office
- **Página de inicio** con carrusel automático, sección de novedades y catálogo de juegos destacados con sub-pestañas
- **Catálogo** con búsqueda en tiempo real, filtrado por plataforma, ordenación por precio y paginación (8 juegos/página)
- **Carrito** con cálculo de subtotal + IVA (21%), eliminación de ítems y códigos de descuento
- **Lista de deseos** persistente con opción de pasar al carrito directamente
- **Registro** con validación de contraseña en tiempo real (regex)
- **Login** multi-idioma (ES, EN, 中文, 日本語, 한국어, Português) con sincronización automática del carrito de invitado
- **Mi cuenta** con ajustes de perfil (nombre, email, contraseña, avatar)

### Back Office (solo administradores)
- Panel unificado con CRUD completo para: usuarios, juegos, carrusel, noticias, novedades, aplicaciones y MyNintendo Store
- Buscador global dentro de cada sección
- Indicador de estado de la API en tiempo real
- Gestión de roles y estados de usuario (activo / inactivo / bloqueado)

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnologías |
|---|---|
| **Frontend** | HTML5, CSS, JavaScript, Fetch API, localStorage |
| **Backend** | PHP, PDO |
| **Base de datos** | MySQL |
| **Arquitectura** | API RESTful, CORS, i18n custom |
| **Herramientas** | Git, phpMyAdmin, VS Code, XAMPP |

---

## 📄 Licencia

Proyecto educativo desarrollado para el módulo **LLM** de **1º DAW**, curso 2025-2026. Sin uso comercial.
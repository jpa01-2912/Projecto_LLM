<?php
// api/index.php
header('Content-Type: application/json; charset=utf-8');

function loadEnv(string $path): void
{
    if (!is_file($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) return;
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        if ($key !== '' && getenv($key) === false) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

function envValue(string $key, ?string $default = null): ?string
{
    $value = $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null || $value === '') return $default;
    return (string) $value;
}

function sendResponse($data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function sendError(string $message, int $statusCode = 500): void
{
    http_response_code($statusCode);
    echo json_encode(['error' => $message]);
    exit;
}

loadEnv(__DIR__ . '/../.env');

$allowedOrigins = array_values(array_filter([
    'http://localhost',
    'http://127.0.0.1',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    envValue('APP_ALLOWED_ORIGIN'),
]));

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$requestOrigin}");
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$host     = envValue('DB_HOST', '127.0.0.1');
$port     = (int) envValue('DB_PORT', '3307');
$user     = envValue('DB_USER', 'root');
$password = envValue('DB_PASS', '');
$database = envValue('DB_NAME', 'tienda');

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $user,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    sendError('Conexion a la base de datos fallida: ' . $e->getMessage(), 500);
}

$request = $_GET['request'] ?? '';
$parts   = explode('/', trim($request, '/'));

if (empty($parts[0])) {
    $path      = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $apiPrefix = '/api/';
    $pos       = strpos($path, $apiPrefix);
    if ($pos !== false) {
        $path  = substr($path, $pos + strlen($apiPrefix));
        $parts = explode('/', trim($path, '/'));
    }
}

$resource = $parts[0] ?? '';
$id       = isset($parts[1]) && $parts[1] !== '' ? $parts[1] : null;
$method   = $_SERVER['REQUEST_METHOD'];
$input    = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($resource) {

        // ============================================================
        // USUARIOS
        // ============================================================
        case 'usuarios':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM usuarios ORDER BY id');
                sendResponse($stmt->fetchAll());

            } elseif ($method === 'POST') {
                $nombre        = $input['nombre']         ?? '';
                $email         = $input['email']          ?? '';
                $password      = $input['password']       ?? '';
                $rol           = $input['rol']            ?? 'user';
                $estado        = $input['estado']         ?? 'activo';
                $fechaRegistro = $input['fecha_registro'] ?? date('Y-m-d');
                $avatar        = $input['avatar']         ?? '';

                $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_registro, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$nombre, $email, $password, $rol, $estado, $fechaRegistro, $avatar]);
                sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Usuario creado'], 201);

            } elseif ($method === 'PUT' && $id) {
                $nombre        = $input['nombre']         ?? '';
                $email         = $input['email']          ?? '';
                $password      = $input['password']       ?? '';
                $rol           = $input['rol']            ?? 'user';
                $estado        = $input['estado']         ?? 'activo';
                $fechaRegistro = $input['fecha_registro'] ?? date('Y-m-d');
                $avatar        = $input['avatar']         ?? '';

                $stmt = $pdo->prepare('UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, estado=?, fecha_registro=?, avatar=? WHERE id=?');
                $stmt->execute([$nombre, $email, $password, $rol, $estado, $fechaRegistro, $avatar, $id]);
                sendResponse(['message' => 'Usuario actualizado']);

            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM usuarios WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Usuario eliminado']);
            }
            break;

        // ============================================================
        // JUEGOS — columnas renombradas + JOIN con plataformas
        // titulo (antes: juego), plataforma_id FK, fecha_lanzamiento (antes: fecha), es_nueva_consola (antes: esNuevaConsola)
        // ============================================================
        case 'juegos':
            if ($method === 'GET') {
                // Devuelve también el nombre de la plataforma para el frontend
                $stmt = $pdo->query('
                    SELECT j.id, j.titulo, j.plataforma_id,
                           p.nombre AS plataforma,
                           j.fecha_lanzamiento AS fecha,
                           j.imagen,
                           j.es_nueva_consola AS esNuevaConsola,
                           j.precio
                    FROM juegos j
                    LEFT JOIN plataformas p ON j.plataforma_id = p.id
                    ORDER BY j.id
                ');
                sendResponse($stmt->fetchAll());

            } elseif ($method === 'POST') {
                $titulo          = $input['titulo']          ?? ($input['juego'] ?? '');
                $plataformaId    = $input['plataforma_id']   ?? null;
                $fechaLanzamiento = $input['fecha_lanzamiento'] ?? ($input['fecha'] ?? '');
                $imagen          = $input['imagen']          ?? '';
                $esNuevaConsola  = !empty($input['esNuevaConsola']) ? 1 : 0;
                $precio          = $input['precio']          ?? null;

                $stmt = $pdo->prepare('INSERT INTO juegos (titulo, plataforma_id, fecha_lanzamiento, imagen, es_nueva_consola, precio) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([$titulo, $plataformaId, $fechaLanzamiento, $imagen, $esNuevaConsola, $precio]);
                sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Juego añadido'], 201);

            } elseif ($method === 'PUT' && $id) {
                $titulo          = $input['titulo']          ?? ($input['juego'] ?? '');
                $plataformaId    = $input['plataforma_id']   ?? null;
                $fechaLanzamiento = $input['fecha_lanzamiento'] ?? ($input['fecha'] ?? '');
                $imagen          = $input['imagen']          ?? '';
                $esNuevaConsola  = !empty($input['esNuevaConsola']) ? 1 : 0;
                $precio          = $input['precio']          ?? null;

                $stmt = $pdo->prepare('UPDATE juegos SET titulo=?, plataforma_id=?, fecha_lanzamiento=?, imagen=?, es_nueva_consola=?, precio=? WHERE id=?');
                $stmt->execute([$titulo, $plataformaId, $fechaLanzamiento, $imagen, $esNuevaConsola, $precio, $id]);
                sendResponse(['message' => 'Juego actualizado']);

            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM juegos WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Juego eliminado']);
            }
            break;

        // ============================================================
        // PLATAFORMAS — nuevo endpoint de solo lectura para el admin
        // ============================================================
        case 'plataformas':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM plataformas ORDER BY id');
                sendResponse($stmt->fetchAll());
            }
            break;

        // ============================================================
        // ETIQUETAS — nuevo endpoint de solo lectura para el admin
        // ============================================================
        case 'etiquetas':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM etiquetas ORDER BY id');
                sendResponse($stmt->fetchAll());
            }
            break;

        // ============================================================
        // APLICACIONES — columnas renombradas + JOIN con plataformas
        // nombre (antes: aplicacion), plataforma_id FK, fecha_lanzamiento (antes: fecha)
        // ============================================================
        case 'aplicaciones':
            if ($method === 'GET') {
                $stmt = $pdo->query('
                    SELECT a.id, a.nombre AS aplicacion,
                           a.plataforma_id,
                           p.nombre AS plataforma,
                           a.fecha_lanzamiento AS fecha,
                           a.imagen
                    FROM aplicaciones a
                    LEFT JOIN plataformas p ON a.plataforma_id = p.id
                ');
                sendResponse($stmt->fetchAll());

            } elseif ($method === 'POST') {
                $nombre          = $input['nombre']          ?? ($input['aplicacion'] ?? '');
                $plataformaId    = $input['plataforma_id']   ?? null;
                $fechaLanzamiento = $input['fecha_lanzamiento'] ?? ($input['fecha'] ?? '');
                $imagen          = $input['imagen']          ?? '';

                $stmt = $pdo->prepare('INSERT INTO aplicaciones (nombre, plataforma_id, fecha_lanzamiento, imagen) VALUES (?, ?, ?, ?)');
                $stmt->execute([$nombre, $plataformaId, $fechaLanzamiento, $imagen]);
                sendResponse(['id' => $pdo->lastInsertId()], 201);

            } elseif ($method === 'PUT' && $id) {
                $nombre          = $input['nombre']          ?? ($input['aplicacion'] ?? '');
                $plataformaId    = $input['plataforma_id']   ?? null;
                $fechaLanzamiento = $input['fecha_lanzamiento'] ?? ($input['fecha'] ?? '');
                $imagen          = $input['imagen']          ?? '';

                $stmt = $pdo->prepare('UPDATE aplicaciones SET nombre=?, plataforma_id=?, fecha_lanzamiento=?, imagen=? WHERE id=?');
                $stmt->execute([$nombre, $plataformaId, $fechaLanzamiento, $imagen, $id]);
                sendResponse(['message' => 'Aplicacion actualizada']);

            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM aplicaciones WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Aplicacion eliminada']);
            }
            break;

        // ============================================================
        // CARROUSEL — columna renombrada: url → url_imagen
        // ============================================================
        case 'carrousel':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM carrousel ORDER BY orden ASC, id ASC');
                // Alias url_imagen → url para compatibilidad con el frontend existente
                $rows = array_map(function($row) {
                    $row['url'] = $row['url_imagen'];
                    return $row;
                }, $stmt->fetchAll());
                sendResponse($rows);

            } elseif ($method === 'POST') {
                $urlImagen  = $input['url_imagen'] ?? ($input['url'] ?? '');
                $alt        = $input['alt']        ?? '';
                $titulo     = $input['titulo']     ?? '';
                $botonTexto = $input['boton_texto'] ?? '';
                $link       = $input['link']       ?? '';
                $orden      = $input['orden']      ?? 0;

                $stmt = $pdo->prepare('INSERT INTO carrousel (url_imagen, alt, titulo, boton_texto, link, orden) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([$urlImagen, $alt, $titulo, $botonTexto, $link, $orden]);
                sendResponse(['id' => $pdo->lastInsertId()], 201);

            } elseif ($method === 'PUT' && $id) {
                $urlImagen  = $input['url_imagen'] ?? ($input['url'] ?? '');
                $alt        = $input['alt']        ?? '';
                $titulo     = $input['titulo']     ?? '';
                $botonTexto = $input['boton_texto'] ?? '';
                $link       = $input['link']       ?? '';
                $orden      = $input['orden']      ?? 0;

                $stmt = $pdo->prepare('UPDATE carrousel SET url_imagen=?, alt=?, titulo=?, boton_texto=?, link=?, orden=? WHERE id=?');
                $stmt->execute([$urlImagen, $alt, $titulo, $botonTexto, $link, $orden, $id]);
                sendResponse(['message' => 'Elemento del carrusel actualizado']);

            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM carrousel WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Elemento del carrusel eliminado']);
            }
            break;

        // ============================================================
        // MY NINTENDO STORE — columna renombrada: aplicacion → nombre
        // ============================================================
        case 'myNintendoStore':
            if ($method === 'GET') {
                // Alias nombre → aplicacion para compatibilidad con el frontend existente
                $stmt = $pdo->query('SELECT id, nombre, descripcion, imagen FROM mynintendostore');
                sendResponse($stmt->fetchAll());

            } elseif ($method === 'POST') {
                $nombre      = $input['nombre']      ?? ($input['aplicacion'] ?? '');
                $descripcion = $input['descripcion'] ?? '';
                $imagen      = $input['imagen']      ?? '';

                $stmt = $pdo->prepare('INSERT INTO mynintendostore (nombre, descripcion, imagen) VALUES (?, ?, ?)');
                $stmt->execute([$nombre, $descripcion, $imagen]);
                sendResponse(['id' => $pdo->lastInsertId()], 201);

            } elseif ($method === 'PUT' && $id) {
                $nombre      = $input['nombre']      ?? ($input['aplicacion'] ?? '');
                $descripcion = $input['descripcion'] ?? '';
                $imagen      = $input['imagen']      ?? '';

                $stmt = $pdo->prepare('UPDATE mynintendostore SET nombre=?, descripcion=?, imagen=? WHERE id=?');
                $stmt->execute([$nombre, $descripcion, $imagen, $id]);
                sendResponse(['message' => 'Elemento actualizado']);

            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM mynintendostore WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Elemento eliminado']);
            }
            break;

        // ============================================================
        // NOVEDADES — JOIN con etiquetas en principal y secundarias
        // ============================================================
        case 'novedades':
            if ($method === 'GET') {
                $principal = $pdo->query('
                    SELECT np.id, np.imagen,
                           e.nombre AS etiqueta,
                           np.titulo, np.descripcion
                    FROM novedades_principal np
                    LEFT JOIN etiquetas e ON np.etiqueta_id = e.id
                    LIMIT 1
                ')->fetch();

                $secundarias = $pdo->query('
                    SELECT ns.id, ns.imagen,
                           e.nombre AS etiqueta,
                           ns.titulo, ns.orden
                    FROM novedades_secundarias ns
                    LEFT JOIN etiquetas e ON ns.etiqueta_id = e.id
                    ORDER BY ns.orden ASC
                ')->fetchAll();

                sendResponse([
                    'principal'   => $principal ?: new stdClass(),
                    'secundarias' => $secundarias ?: [],
                ]);

            } elseif ($method === 'PUT') {
                // Actualizar noticia principal
                if (!empty($input['principal'])) {
                    $p = $input['principal'];
                    // Resolver etiqueta_id desde nombre
                    $etiquetaId = null;
                    if (!empty($p['etiqueta'])) {
                        $se = $pdo->prepare('SELECT id FROM etiquetas WHERE nombre = ?');
                        $se->execute([$p['etiqueta']]);
                        $et = $se->fetch();
                        $etiquetaId = $et ? $et['id'] : null;
                    }
                    $pdo->prepare('UPDATE novedades_principal SET imagen=?, etiqueta_id=?, titulo=?, descripcion=? WHERE id=1')
                        ->execute([$p['imagen'] ?? '', $etiquetaId, $p['titulo'] ?? '', $p['descripcion'] ?? '']);
                }

                // Actualizar secundarias: borrar y reinsertar
                if (isset($input['secundarias']) && is_array($input['secundarias'])) {
                    $pdo->exec('DELETE FROM novedades_secundarias');
                    $ins = $pdo->prepare('INSERT INTO novedades_secundarias (imagen, etiqueta_id, titulo, orden) VALUES (?, ?, ?, ?)');
                    foreach ($input['secundarias'] as $i => $s) {
                        $etiquetaId = null;
                        if (!empty($s['etiqueta'])) {
                            $se = $pdo->prepare('SELECT id FROM etiquetas WHERE nombre = ?');
                            $se->execute([$s['etiqueta']]);
                            $et = $se->fetch();
                            $etiquetaId = $et ? $et['id'] : null;
                        }
                        $ins->execute([$s['imagen'] ?? '', $etiquetaId, $s['titulo'] ?? '', $i + 1]);
                    }
                }
                sendResponse(['message' => 'Novedades actualizadas']);
            }
            break;

        // ============================================================
        // NOTICIAS — JOIN con etiquetas
        // ============================================================
        case 'noticias':
            if ($method === 'GET') {
                $stmt = $pdo->query('
                    SELECT n.id, n.titulo, n.imagen,
                           e.nombre AS etiqueta,
                           n.fecha, n.link
                    FROM noticias n
                    LEFT JOIN etiquetas e ON n.etiqueta_id = e.id
                    ORDER BY n.id DESC
                ');
                sendResponse($stmt->fetchAll());

            } elseif ($method === 'POST') {
                $titulo  = $input['titulo']  ?? '';
                $imagen  = $input['imagen']  ?? '';
                $etiqueta = $input['etiqueta'] ?? '';
                $fecha   = $input['fecha']   ?? '';
                $link    = $input['link']    ?? '#';

                // Resolver etiqueta_id
                $etiquetaId = null;
                if ($etiqueta !== '') {
                    $se = $pdo->prepare('SELECT id FROM etiquetas WHERE nombre = ?');
                    $se->execute([$etiqueta]);
                    $et = $se->fetch();
                    $etiquetaId = $et ? $et['id'] : null;
                }

                $stmt = $pdo->prepare('INSERT INTO noticias (titulo, imagen, etiqueta_id, fecha, link) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$titulo, $imagen, $etiquetaId, $fecha, $link]);
                sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Noticia creada'], 201);

            } elseif ($method === 'PUT' && $id) {
                $titulo  = $input['titulo']  ?? '';
                $imagen  = $input['imagen']  ?? '';
                $etiqueta = $input['etiqueta'] ?? '';
                $fecha   = $input['fecha']   ?? '';
                $link    = $input['link']    ?? '#';

                $etiquetaId = null;
                if ($etiqueta !== '') {
                    $se = $pdo->prepare('SELECT id FROM etiquetas WHERE nombre = ?');
                    $se->execute([$etiqueta]);
                    $et = $se->fetch();
                    $etiquetaId = $et ? $et['id'] : null;
                }

                $stmt = $pdo->prepare('UPDATE noticias SET titulo=?, imagen=?, etiqueta_id=?, fecha=?, link=? WHERE id=?');
                $stmt->execute([$titulo, $imagen, $etiquetaId, $fecha, $link, $id]);
                sendResponse(['message' => 'Noticia actualizada']);

            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM noticias WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Noticia eliminada']);
            }
            break;

        // ============================================================
        // CARRITO — nuevo endpoint (BD)
        // GET    /api/carrito?usuario_id=X  → carrito del usuario
        // POST   /api/carrito               → { usuario_id, juego_id, cantidad }
        // PUT    /api/carrito/{id}          → actualizar cantidad
        // DELETE /api/carrito/{id}          → eliminar línea
        // DELETE /api/carrito?usuario_id=X  → vaciar carrito completo
        // ============================================================
        case 'carrito':
            if ($method === 'GET') {
                $usuarioId = $_GET['usuario_id'] ?? null;
                if (!$usuarioId) sendError('usuario_id requerido', 400);

                $stmt = $pdo->prepare('
                    SELECT c.id, c.usuario_id, c.juego_id, c.cantidad, c.fecha_agregado,
                           j.titulo AS juego, j.imagen, j.precio,
                           p.nombre AS plataforma,
                           j.es_nueva_consola AS esNuevaConsola
                    FROM carrito c
                    JOIN juegos j ON c.juego_id = j.id
                    LEFT JOIN plataformas p ON j.plataforma_id = p.id
                    WHERE c.usuario_id = ?
                    ORDER BY c.fecha_agregado DESC
                ');
                $stmt->execute([$usuarioId]);
                sendResponse($stmt->fetchAll());

            } elseif ($method === 'POST') {
                $usuarioId = $input['usuario_id'] ?? null;
                $juegoId   = $input['juego_id']   ?? null;
                $cantidad  = $input['cantidad']   ?? 1;

                if (!$usuarioId || !$juegoId) sendError('usuario_id y juego_id son requeridos', 400);

                // Si ya existe, incrementar cantidad
                $check = $pdo->prepare('SELECT id, cantidad FROM carrito WHERE usuario_id=? AND juego_id=?');
                $check->execute([$usuarioId, $juegoId]);
                $existing = $check->fetch();

                if ($existing) {
                    $pdo->prepare('UPDATE carrito SET cantidad = cantidad + ? WHERE id = ?')
                        ->execute([$cantidad, $existing['id']]);
                    sendResponse(['message' => 'Cantidad actualizada']);
                } else {
                    $pdo->prepare('INSERT INTO carrito (usuario_id, juego_id, cantidad) VALUES (?, ?, ?)')
                        ->execute([$usuarioId, $juegoId, $cantidad]);
                    sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Añadido al carrito'], 201);
                }

            } elseif ($method === 'PUT' && $id) {
                $cantidad = $input['cantidad'] ?? 1;
                $pdo->prepare('UPDATE carrito SET cantidad=? WHERE id=?')->execute([$cantidad, $id]);
                sendResponse(['message' => 'Cantidad actualizada']);

            } elseif ($method === 'DELETE') {
                if ($id) {
                    // Eliminar línea concreta
                    $pdo->prepare('DELETE FROM carrito WHERE id=?')->execute([$id]);
                    sendResponse(['message' => 'Producto eliminado del carrito']);
                } else {
                    // Vaciar carrito completo de un usuario
                    $usuarioId = $_GET['usuario_id'] ?? null;
                    if (!$usuarioId) sendError('id o usuario_id requerido', 400);
                    $pdo->prepare('DELETE FROM carrito WHERE usuario_id=?')->execute([$usuarioId]);
                    sendResponse(['message' => 'Carrito vaciado']);
                }
            }
            break;

        // ============================================================
        // FAVORITOS — nuevo endpoint (BD)
        // GET    /api/favoritos?usuario_id=X → favoritos del usuario
        // POST   /api/favoritos              → { usuario_id, juego_id }
        // DELETE /api/favoritos/{id}         → eliminar favorito
        // ============================================================
        case 'favoritos':
            if ($method === 'GET') {
                $usuarioId = $_GET['usuario_id'] ?? null;
                if (!$usuarioId) sendError('usuario_id requerido', 400);

                $stmt = $pdo->prepare('
                    SELECT f.id, f.usuario_id, f.juego_id, f.fecha_agregado,
                           j.titulo AS juego, j.imagen, j.precio,
                           p.nombre AS plataforma,
                           j.fecha_lanzamiento AS fecha,
                           j.es_nueva_consola AS esNuevaConsola
                    FROM favoritos f
                    JOIN juegos j ON f.juego_id = j.id
                    LEFT JOIN plataformas p ON j.plataforma_id = p.id
                    WHERE f.usuario_id = ?
                    ORDER BY f.fecha_agregado DESC
                ');
                $stmt->execute([$usuarioId]);
                sendResponse($stmt->fetchAll());

            } elseif ($method === 'POST') {
                $usuarioId = $input['usuario_id'] ?? null;
                $juegoId   = $input['juego_id']   ?? null;

                if (!$usuarioId || !$juegoId) sendError('usuario_id y juego_id son requeridos', 400);

                // Evitar duplicados
                $check = $pdo->prepare('SELECT id FROM favoritos WHERE usuario_id=? AND juego_id=?');
                $check->execute([$usuarioId, $juegoId]);
                if ($check->fetch()) {
                    sendResponse(['message' => 'Ya está en favoritos']);
                }

                $pdo->prepare('INSERT INTO favoritos (usuario_id, juego_id) VALUES (?, ?)')
                    ->execute([$usuarioId, $juegoId]);
                sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Añadido a favoritos'], 201);

            } elseif ($method === 'DELETE' && $id) {
                $pdo->prepare('DELETE FROM favoritos WHERE id=?')->execute([$id]);
                sendResponse(['message' => 'Eliminado de favoritos']);
            }
            break;

        // ============================================================
        // STATS
        // ============================================================
        case 'stats':
            if ($id === 'db' && $method === 'GET') {
                $stmt = $pdo->query('SHOW TABLES');
                sendResponse(['total' => count($stmt->fetchAll())]);
            }
            sendResponse(['message' => 'Recurso no encontrado'], 404);
            break;

        default:
            sendResponse(['message' => 'API en funcionamiento, recurso no encontrado o no especificado'], 404);
            break;
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
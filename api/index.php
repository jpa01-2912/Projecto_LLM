<?php
// api/index.php
header('Content-Type: application/json; charset=utf-8');

function loadEnv(string $path): void
{
    if (!is_file($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
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
    if ($value === false || $value === null || $value === '') {
        return $default;
    }

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

$host = envValue('DB_HOST', '127.0.0.1');
$port = (int) envValue('DB_PORT', '3307');
$user = envValue('DB_USER', 'root');
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

// Obtener el recurso dinamicamente de la URL
$request = $_GET['request'] ?? '';
$parts = explode('/', trim($request, '/'));

// Si no hay request via GET (por ejemplo, servidor built-in PHP), intentar procesar el REQUEST_URI
if (empty($parts[0])) {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $apiPrefix = '/api/';
    $pos = strpos($path, $apiPrefix);
    if ($pos !== false) {
        $path = substr($path, $pos + strlen($apiPrefix));
        $parts = explode('/', trim($path, '/'));
    }
}

$resource = $parts[0] ?? '';
$id = $parts[1] ?? null;

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($resource) {
        case 'usuarios':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM usuarios ORDER BY id');
                sendResponse($stmt->fetchAll());
            } elseif ($method === 'POST') {
                $nombre = $input['nombre'] ?? '';
                $email = $input['email'] ?? '';
                $password = $input['password'] ?? '';
                $rol = $input['rol'] ?? 'user';
                $estado = $input['estado'] ?? 'activo';
                $fechaRegistro = $input['fecha_registro'] ?? date('Y-m-d');
                $avatar = $input['avatar'] ?? '';

                $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_registro, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$nombre, $email, $password, $rol, $estado, $fechaRegistro, $avatar]);
                sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Usuario creado'], 201);
            } elseif ($method === 'PUT' && $id) {
                $nombre = $input['nombre'] ?? '';
                $email = $input['email'] ?? '';
                $password = $input['password'] ?? '';
                $rol = $input['rol'] ?? 'user';
                $estado = $input['estado'] ?? 'activo';
                $fechaRegistro = $input['fecha_registro'] ?? date('Y-m-d');
                $avatar = $input['avatar'] ?? '';

                $stmt = $pdo->prepare('UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, estado=?, fecha_registro=?, avatar=? WHERE id=?');
                $stmt->execute([$nombre, $email, $password, $rol, $estado, $fechaRegistro, $avatar, $id]);
                sendResponse(['message' => 'Usuario actualizado']);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM usuarios WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Usuario eliminado']);
            }
            break;

        case 'juegos':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM juegos ORDER BY id');
                sendResponse($stmt->fetchAll());
            } elseif ($method === 'POST') {
                $juego = $input['juego'] ?? '';
                $plataforma = $input['plataforma'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $imagen = $input['imagen'] ?? '';
                $esNuevaConsola = !empty($input['esNuevaConsola']) ? 1 : 0;
                $precio = $input['precio'] ?? null;

                $stmt = $pdo->prepare('INSERT INTO juegos (juego, plataforma, fecha, imagen, esNuevaConsola, precio) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([$juego, $plataforma, $fecha, $imagen, $esNuevaConsola, $precio]);
                sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Juego anadido'], 201);
            } elseif ($method === 'PUT' && $id) {
                $juego = $input['juego'] ?? '';
                $plataforma = $input['plataforma'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $imagen = $input['imagen'] ?? '';
                $esNuevaConsola = !empty($input['esNuevaConsola']) ? 1 : 0;
                $precio = $input['precio'] ?? null;

                $stmt = $pdo->prepare('UPDATE juegos SET juego=?, plataforma=?, fecha=?, imagen=?, esNuevaConsola=?, precio=? WHERE id=?');
                $stmt->execute([$juego, $plataforma, $fecha, $imagen, $esNuevaConsola, $precio, $id]);
                sendResponse(['message' => 'Juego actualizado']);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM juegos WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Juego eliminado']);
            }
            break;

        case 'aplicaciones':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM aplicaciones');
                sendResponse($stmt->fetchAll());
            } elseif ($method === 'POST') {
                $aplicacion = $input['aplicacion'] ?? '';
                $plataforma = $input['plataforma'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $imagen = $input['imagen'] ?? '';

                $stmt = $pdo->prepare('INSERT INTO aplicaciones (aplicacion, plataforma, fecha, imagen) VALUES (?, ?, ?, ?)');
                $stmt->execute([$aplicacion, $plataforma, $fecha, $imagen]);
                sendResponse(['id' => $pdo->lastInsertId()], 201);
            } elseif ($method === 'PUT' && $id) {
                $aplicacion = $input['aplicacion'] ?? '';
                $plataforma = $input['plataforma'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $imagen = $input['imagen'] ?? '';

                $stmt = $pdo->prepare('UPDATE aplicaciones SET aplicacion=?, plataforma=?, fecha=?, imagen=? WHERE id=?');
                $stmt->execute([$aplicacion, $plataforma, $fecha, $imagen, $id]);
                sendResponse(['message' => 'Aplicacion actualizada']);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM aplicaciones WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Aplicacion eliminada']);
            }
            break;

        case 'carrousel':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM carrousel ORDER BY id');
                sendResponse($stmt->fetchAll());
            } elseif ($method === 'POST') {
                $url = $input['url'] ?? '';
                $alt = $input['alt'] ?? '';
                $titulo = $input['titulo'] ?? '';
                $botonTexto = $input['boton_texto'] ?? '';
                $link = $input['link'] ?? '';

                $stmt = $pdo->prepare('INSERT INTO carrousel (url, alt, titulo, boton_texto, link) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$url, $alt, $titulo, $botonTexto, $link]);
                sendResponse(['id' => $pdo->lastInsertId()], 201);
            } elseif ($method === 'PUT' && $id) {
                $url = $input['url'] ?? '';
                $alt = $input['alt'] ?? '';
                $titulo = $input['titulo'] ?? '';
                $botonTexto = $input['boton_texto'] ?? '';
                $link = $input['link'] ?? '';

                $stmt = $pdo->prepare('UPDATE carrousel SET url=?, alt=?, titulo=?, boton_texto=?, link=? WHERE id=?');
                $stmt->execute([$url, $alt, $titulo, $botonTexto, $link, $id]);
                sendResponse(['message' => 'Elemento del carrusel actualizado']);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM carrousel WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Elemento del carrusel eliminado']);
            }
            break;

        case 'myNintendoStore':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM myNintendoStore');
                sendResponse($stmt->fetchAll());
            } elseif ($method === 'POST') {
                $aplicacion = $input['aplicacion'] ?? '';
                $descripcion = $input['descripcion'] ?? '';
                $imagen = $input['imagen'] ?? '';

                $stmt = $pdo->prepare('INSERT INTO myNintendoStore (aplicacion, descripcion, imagen) VALUES (?, ?, ?)');
                $stmt->execute([$aplicacion, $descripcion, $imagen]);
                sendResponse(['id' => $pdo->lastInsertId()], 201);
            } elseif ($method === 'PUT' && $id) {
                $aplicacion = $input['aplicacion'] ?? '';
                $descripcion = $input['descripcion'] ?? '';
                $imagen = $input['imagen'] ?? '';

                $stmt = $pdo->prepare('UPDATE myNintendoStore SET aplicacion=?, descripcion=?, imagen=? WHERE id=?');
                $stmt->execute([$aplicacion, $descripcion, $imagen, $id]);
                sendResponse(['message' => 'Elemento actualizado']);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM myNintendoStore WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Elemento eliminado']);
            }
            break;

        case 'novedades':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT principal, secundarias, otrasNoticias FROM novedades WHERE id = 1');
                $row = $stmt->fetch();
                if (!$row) {
                    sendResponse(['principal' => new stdClass(), 'secundarias' => [], 'otrasNoticias' => []]);
                }

                sendResponse([
                    'principal' => json_decode($row['principal'] ?: '{}', true) ?: new stdClass(),
                    'secundarias' => json_decode($row['secundarias'] ?: '[]', true) ?: [],
                    'otrasNoticias' => json_decode($row['otrasNoticias'] ?: '[]', true) ?: [],
                ]);
            } elseif ($method === 'PUT') {
                $principal = isset($input['principal']) ? json_encode($input['principal']) : '{}';
                $secundarias = isset($input['secundarias']) ? json_encode($input['secundarias']) : '[]';
                $otrasNoticias = isset($input['otrasNoticias']) ? json_encode($input['otrasNoticias']) : '[]';

                $stmt = $pdo->prepare('UPDATE novedades SET principal = ?, secundarias = ?, otrasNoticias = ? WHERE id = 1');
                $stmt->execute([$principal, $secundarias, $otrasNoticias]);
                sendResponse(['message' => 'Novedades actualizadas']);
            } elseif ($method === 'POST') {
                $stmt = $pdo->query('SELECT principal, secundarias, otrasNoticias FROM novedades WHERE id = 1');
                $row = $stmt->fetch();

                $principal = isset($input['principal']) ? json_encode($input['principal']) : $row['principal'];
                $secundarias = isset($input['secundarias']) ? json_encode($input['secundarias']) : $row['secundarias'];
                $otrasNoticias = isset($input['otrasNoticias']) ? json_encode($input['otrasNoticias']) : $row['otrasNoticias'];

                $stmt = $pdo->prepare('UPDATE novedades SET principal = ?, secundarias = ?, otrasNoticias = ? WHERE id = 1');
                $stmt->execute([$principal, $secundarias, $otrasNoticias]);
                sendResponse(['message' => 'Novedades actualizadas via POST']);
            }
            break;

        case 'noticias':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM noticias ORDER BY id DESC');
                sendResponse($stmt->fetchAll());
            } elseif ($method === 'POST') {
                $titulo = $input['titulo'] ?? '';
                $imagen = $input['imagen'] ?? '';
                $etiqueta = $input['etiqueta'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $link = $input['link'] ?? '#';

                $stmt = $pdo->prepare('INSERT INTO noticias (titulo, imagen, etiqueta, fecha, link) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$titulo, $imagen, $etiqueta, $fecha, $link]);
                sendResponse(['id' => $pdo->lastInsertId(), 'message' => 'Noticia creada'], 201);
            } elseif ($method === 'PUT' && $id) {
                $titulo = $input['titulo'] ?? '';
                $imagen = $input['imagen'] ?? '';
                $etiqueta = $input['etiqueta'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $link = $input['link'] ?? '#';

                $stmt = $pdo->prepare('UPDATE noticias SET titulo=?, imagen=?, etiqueta=?, fecha=?, link=? WHERE id=?');
                $stmt->execute([$titulo, $imagen, $etiqueta, $fecha, $link, $id]);
                sendResponse(['message' => 'Noticia actualizada']);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM noticias WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(['message' => 'Noticia eliminada']);
            }
            break;

        case 'stats':
            if ($id === 'db' && $method === 'GET') {
                $stmt = $pdo->query('SHOW TABLES');
                $tables = $stmt->fetchAll();
                sendResponse(['total' => count($tables)]);
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

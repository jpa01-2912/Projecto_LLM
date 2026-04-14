<?php
// api/index.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = 'localhost';
$user = 'root';
$password = '';
$database = 'tienda';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión a la base de datos fallida: " . $e->getMessage()]);
    exit;
}

// Obtener el recurso dinámicamente de la URL
$request = $_GET['request'] ?? '';
$parts = explode('/', trim($request, '/'));

// Si no hay request vía GET (por ejemplo, servidor built-in PHP), intentar procesar el REQUEST_URI
if (empty($parts[0])) {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $api_prefix = '/api/';
    $pos = strpos($path, $api_prefix);
    if ($pos !== false) {
        $path = substr($path, $pos + strlen($api_prefix));
        $parts = explode('/', trim($path, '/'));
    }
}

$resource = $parts[0] ?? '';
$id = $parts[1] ?? null;

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? [];

header('Content-Type: application/json');

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function sendError($message, $statusCode = 500) {
    http_response_code($statusCode);
    echo json_encode(["error" => $message]);
    exit;
}

try {
    switch ($resource) {
        case 'usuarios':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM usuarios ORDER BY id');
                sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($method === 'POST') {
                $nombre = $input['nombre'] ?? '';
                $email = $input['email'] ?? '';
                $password = $input['password'] ?? '';
                $rol = $input['rol'] ?? 'user';
                $estado = $input['estado'] ?? 'activo';
                $fecha_registro = $input['fecha_registro'] ?? date('Y-m-d');
                $avatar = $input['avatar'] ?? '';
                
                $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_registro, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$nombre, $email, $password, $rol, $estado, $fecha_registro, $avatar]);
                sendResponse(["id" => $pdo->lastInsertId(), "message" => "Usuario creado"], 201);
            } elseif ($method === 'PUT' && $id) {
                $nombre = $input['nombre'] ?? '';
                $email = $input['email'] ?? '';
                $password = $input['password'] ?? '';
                $rol = $input['rol'] ?? 'user';
                $estado = $input['estado'] ?? 'activo';
                $avatar = $input['avatar'] ?? '';
                
                $stmt = $pdo->prepare('UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, estado=?, avatar=? WHERE id=?');
                $stmt->execute([$nombre, $email, $password, $rol, $estado, $avatar, $id]);
                sendResponse(["message" => "Usuario actualizado"]);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM usuarios WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(["message" => "Usuario eliminado"]);
            }
            break;

        case 'juegos':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM juegos ORDER BY id');
                sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($method === 'POST') {
                $juego = $input['juego'] ?? '';
                $plataforma = $input['plataforma'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $imagen = $input['imagen'] ?? '';
                $esNuevaConsola = isset($input['esNuevaConsola']) && $input['esNuevaConsola'] ? 1 : 0;
                $precio = $input['precio'] ?? null;
                
                $stmt = $pdo->prepare('INSERT INTO juegos (juego, plataforma, fecha, imagen, esNuevaConsola, precio) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([$juego, $plataforma, $fecha, $imagen, $esNuevaConsola, $precio]);
                sendResponse(["id" => $pdo->lastInsertId(), "message" => "Juego añadido"], 201);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM juegos WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(["message" => "Juego eliminado"]);
            }
            break;

        case 'aplicaciones':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM aplicaciones');
                sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($method === 'POST') {
                $aplicacion = $input['aplicacion'] ?? '';
                $plataforma = $input['plataforma'] ?? '';
                $fecha = $input['fecha'] ?? '';
                $imagen = $input['imagen'] ?? '';
                
                $stmt = $pdo->prepare('INSERT INTO aplicaciones (aplicacion, plataforma, fecha, imagen) VALUES (?, ?, ?, ?)');
                $stmt->execute([$aplicacion, $plataforma, $fecha, $imagen]);
                sendResponse(["id" => $pdo->lastInsertId()], 201);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM aplicaciones WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(["message" => "Aplicación eliminada"]);
            }
            break;

        case 'carrousel':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM carrousel ORDER BY id');
                sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($method === 'POST') {
                $url = $input['url'] ?? '';
                $alt = $input['alt'] ?? '';
                $titulo = $input['titulo'] ?? '';
                $boton_texto = $input['boton_texto'] ?? '';
                $link = $input['link'] ?? '';
                
                $stmt = $pdo->prepare('INSERT INTO carrousel (url, alt, titulo, boton_texto, link) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$url, $alt, $titulo, $boton_texto, $link]);
                sendResponse(["id" => $pdo->lastInsertId()], 201);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM carrousel WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(["message" => "Elemento del carrusel eliminado"]);
            }
            break;

        case 'myNintendoStore':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT * FROM myNintendoStore');
                sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($method === 'POST') {
                $aplicacion = $input['aplicacion'] ?? '';
                $descripcion = $input['descripcion'] ?? '';
                $imagen = $input['imagen'] ?? '';
                
                $stmt = $pdo->prepare('INSERT INTO myNintendoStore (aplicacion, descripcion, imagen) VALUES (?, ?, ?)');
                $stmt->execute([$aplicacion, $descripcion, $imagen]);
                sendResponse(["id" => $pdo->lastInsertId()], 201);
            } elseif ($method === 'DELETE' && $id) {
                $stmt = $pdo->prepare('DELETE FROM myNintendoStore WHERE id = ?');
                $stmt->execute([$id]);
                sendResponse(["message" => "Elemento eliminado"]);
            }
            break;

        case 'novedades':
            if ($method === 'GET') {
                $stmt = $pdo->query('SELECT principal, secundarias, otrasNoticias FROM novedades WHERE id = 1');
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$row) {
                    sendResponse(["principal" => new stdClass(), "secundarias" => [], "otrasNoticias" => []]);
                }
                sendResponse([
                    "principal" => json_decode($row['principal'] ?: '{}', true) ?: new stdClass(),
                    "secundarias" => json_decode($row['secundarias'] ?: '[]', true) ?: [],
                    "otrasNoticias" => json_decode($row['otrasNoticias'] ?: '[]', true) ?: []
                ]);
            } elseif ($method === 'PUT') {
                $principal = isset($input['principal']) ? json_encode($input['principal']) : '{}';
                $secundarias = isset($input['secundarias']) ? json_encode($input['secundarias']) : '[]';
                $otrasNoticias = isset($input['otrasNoticias']) ? json_encode($input['otrasNoticias']) : '[]';
                
                $stmt = $pdo->prepare('UPDATE novedades SET principal = ?, secundarias = ?, otrasNoticias = ? WHERE id = 1');
                $stmt->execute([$principal, $secundarias, $otrasNoticias]);
                sendResponse(["message" => "Novedades actualizadas"]);
            } elseif ($method === 'POST') {
                $stmt = $pdo->query('SELECT principal, secundarias, otrasNoticias FROM novedades WHERE id = 1');
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $principal = isset($input['principal']) ? json_encode($input['principal']) : $row['principal'];
                $secundarias = isset($input['secundarias']) ? json_encode($input['secundarias']) : $row['secundarias'];
                $otrasNoticias = isset($input['otrasNoticias']) ? json_encode($input['otrasNoticias']) : $row['otrasNoticias'];
                
                $stmt = $pdo->prepare('UPDATE novedades SET principal = ?, secundarias = ?, otrasNoticias = ? WHERE id = 1');
                $stmt->execute([$principal, $secundarias, $otrasNoticias]);
                sendResponse(["message" => "Novedades actualizadas vía POST"]);
            }
            break;

        default:
            sendResponse(["message" => "API en funcionamiento, recurso no encontrado o no especificado"], 404);
            break;
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}

<?php
// scratch/create_noticias_table.php

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

loadEnv(__DIR__ . '/../.env');

$host = envValue('DB_HOST', '127.0.0.1');
$port = (int) envValue('DB_PORT', '3307');
$user = envValue('DB_USER', 'root');
$password = envValue('DB_PASS', '');
$database = envValue('DB_NAME', 'tienda');

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4",
        $user,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crear la tabla noticias
    $sql = "CREATE TABLE IF NOT EXISTS noticias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        imagen VARCHAR(255) NOT NULL,
        etiqueta VARCHAR(50),
        fecha VARCHAR(20),
        link VARCHAR(255) DEFAULT '#'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    $pdo->exec($sql);
    echo "Tabla 'noticias' creada con éxito.\n";

    // Insertar datos de ejemplo basados en la captura
    $noticias = [
        [
            'titulo' => 'Destacados de Nintendo eShop – 23-04-2026',
            'imagen' => './fotos/noticias/noticia1.jpg',
            'etiqueta' => 'Nintendo Switch',
            'fecha' => '23/04/2026'
        ],
        [
            'titulo' => '¡Ponte al volante y sobrevive a toda costa en el próximo evento europeo en línea de Mario Kart...',
            'imagen' => './fotos/noticias/noticia2.jpg',
            'etiqueta' => 'Nintendo Switch 2',
            'fecha' => '21/04/2026'
        ],
        [
            'titulo' => 'Cómo añadir a Bubbles y demás familia a tu isla de Tomodachi Life: Una vida de ensueño',
            'imagen' => './fotos/noticias/noticia3.jpg',
            'etiqueta' => 'Nintendo Switch',
            'fecha' => '17/04/2026'
        ],
        [
            'titulo' => '¡Aquí están las reseñas de Tomodachi Life: Una vida de ensueño para Nintendo Switch!',
            'imagen' => './fotos/noticias/noticia4.jpg',
            'etiqueta' => '',
            'fecha' => '17/04/2026'
        ],
        [
            'titulo' => 'Destacados de Nintendo eShop – 16-04-2026',
            'imagen' => './fotos/noticias/noticia5.jpg',
            'etiqueta' => 'Nintendo Switch',
            'fecha' => '16/04/2026'
        ],
        [
            'titulo' => '¡Sorteamos el Cuento de Estela!',
            'imagen' => './fotos/noticias/noticia6.jpg',
            'etiqueta' => '',
            'fecha' => '15/04/2026'
        ],
        [
            'titulo' => '¡Ya puedes reservar Yoshi and the Mysterious Book!',
            'imagen' => './fotos/noticias/noticia7.jpg',
            'etiqueta' => 'Nintendo Switch 2',
            'fecha' => '14/04/2026'
        ],
        [
            'titulo' => 'Pregunta al desarrollador, volumen 21. Tomodachi Life: Una vida de ensueño – Capítulo 3',
            'imagen' => './fotos/noticias/noticia8.jpg',
            'etiqueta' => 'Nintendo Switch 2',
            'fecha' => '14/04/2026'
        ]
    ];

    $stmt = $pdo->prepare("INSERT INTO noticias (titulo, imagen, etiqueta, fecha) VALUES (?, ?, ?, ?)");
    foreach ($noticias as $n) {
        $stmt->execute([$n['titulo'], $n['imagen'], $n['etiqueta'], $n['fecha']]);
    }
    
    echo "8 noticias insertadas correctamente.\n";

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}

<?php
// router.php
// Script de enrutamiento para el servidor PHP embebido (built-in web server)
// Uso: php -S localhost:3000 router.php

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// Si se solicita la ruta de la API, se delega al archivo de la API en PHP
if (preg_match('#^/api/#', $path)) {
    require __DIR__ . '/api/index.php';
    return true;
}

// Si el archivo o directorio existe estáticamente, dejar que el servidor lo devuelva
if (file_exists(__DIR__ . $path) && is_file(__DIR__ . $path)) {
    return false;
}

// Si no, podemos devolver el index.html por defecto o dejar que siga su curso
if ($path === '/') {
    require __DIR__ . '/index.html';
    return true;
}

return false;

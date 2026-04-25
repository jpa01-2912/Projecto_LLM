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

// Redirigir la raíz al index.html de la carpeta public
if ($path === '/') {
    $path = '/index.html';
}

$publicPath = __DIR__ . '/public' . $path;

// Si el archivo existe en la carpeta public, servirlo con el Content-Type adecuado
if (file_exists($publicPath) && is_file($publicPath)) {
    $ext = pathinfo($publicPath, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'css'  => 'text/css',
        'js'   => 'application/javascript',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'json' => 'application/json'
    ];
    
    if (isset($mimeTypes[$ext])) {
        header("Content-Type: {$mimeTypes[$ext]}");
    }
    
    readfile($publicPath);
    return true;
}

http_response_code(404);
echo "404 Not Found";
return true;

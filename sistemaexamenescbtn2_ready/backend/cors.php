<?php
// backend/cors.php

// ORÍGENES PERMITIDOS
$allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.94:5173",
    "http://192.168.1.94"
];

// Si ORIGIN no viene en la petición, asumir manualmente desde REFERER
$origin = $_SERVER["HTTP_ORIGIN"]
    ?? (isset($_SERVER["HTTP_REFERER"]) ?
        preg_replace('#/+$#','', dirname($_SERVER["HTTP_REFERER"])) : "");

// Si sigue vacío → no bloquear (modo seguro)
if (!$origin) {
    $origin = "http://192.168.1.94:5173";
}

// Si está permitido, devolver su mismo valor
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://192.168.1.94:5173");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}
?>

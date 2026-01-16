<?php
// backend/admin/get_users.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Ruta correcta al db.php
include '../db.php';

try {
    // ✅ Ahora usamos los nombres EXACTOS de tu tabla
    $sql = "SELECT 
                id AS id,
                username,
                matricula,
                role,
                semester,
                group_name
            FROM users";

    $result = $conn->query($sql);

    $users = [];

    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode([
        "success" => true,
        "users" => $users
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al obtener los usuarios",
        "error" => $e->getMessage()
    ]);
}

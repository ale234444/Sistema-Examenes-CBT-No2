<?php
include "../../db.php";

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

$exam_id = $data->exam_id ?? null;
$is_enabled = $data->is_enabled ?? null;

if (!$exam_id || $is_enabled === null) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos"
    ]);
    exit;
}

$stmt = $conn->prepare("UPDATE exams SET is_enabled = ? WHERE id = ?");
$stmt->bind_param("ii", $is_enabled, $exam_id);

if ($stmt->execute()) {
    echo json_encode([
        
        "success" => true,
        "message" => "Estado actualizado correctamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar"
    ]);
}

<?php
include '../../db.php';

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Leer datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"));

$id = $data->id ?? 0;
$nombre = $data->nombre ?? '';
$materia = $data->materia ?? '';
$semestre = $data->semestre ?? '';
$grupo = $data->grupo ?? '';

if (!$id || !$nombre || !$materia || !$semestre || !$grupo) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios para actualizar el examen"]);
    exit;
}

$stmt = $conn->prepare("UPDATE exams SET nombre = ?, materia = ?, semestre = ?, grupo = ? WHERE id = ?");
$stmt->bind_param("ssssi", $nombre, $materia, $semestre, $grupo, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Examen actualizado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $stmt->error]);
}
?>

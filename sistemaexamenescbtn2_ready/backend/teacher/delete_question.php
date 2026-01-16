<?php
include '../../db.php';

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$question_id = $data->id ?? 0;

if (!$question_id) {
    echo json_encode(["success" => false, "message" => "ID de pregunta no recibido"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM questions WHERE id = ?");
$stmt->bind_param("i", $question_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Pregunta eliminada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar la pregunta: " . $stmt->error]);
}
?>

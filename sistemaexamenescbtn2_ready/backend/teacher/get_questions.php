<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include __DIR__ . '/../../db.php';

// ==== CORS ====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$exam_id = $_GET['exam_id'] ?? 0;

if (!$exam_id) {
    echo json_encode(["success" => false, "questions" => []]);
    exit;
}

$sql = "SELECT id, texto, tipo, opciones, correcta, metadata, image_url 
        FROM questions 
        WHERE exam_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $exam_id);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];

while ($row = $result->fetch_assoc()) {
    // Decodificar campos JSON
    $opciones = json_decode($row['opciones'], true);
    if (json_last_error() !== JSON_ERROR_NONE) $opciones = [];

    $correcta = json_decode($row['correcta'], true);
    if (json_last_error() !== JSON_ERROR_NONE) $correcta = [];

    $metadata = json_decode($row['metadata'], true);
    if (json_last_error() !== JSON_ERROR_NONE) $metadata = [];

    // 🖼️ Ajustar URL de imagen si existe
  // 🖼️ Ajustar URL de imagen si existe
if (!empty($row['image_url'])) {

    // Si NO empieza con http, corregimos
    if (strpos($row['image_url'], 'http') !== 0) {

        // URL correcta de tu servidor
        $row['image_url'] = "http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/" 
                            . basename($row['image_url']);
    }

} else {
    $row['image_url'] = null;
}



    $questions[] = [
        "id" => (int)$row['id'],
        "texto" => $row['texto'],
        "tipo" => $row['tipo'],
        "opciones" => $opciones,
        "correcta" => $correcta,
        "metadata" => $metadata,
        "image_url" => $row['image_url'],
    ];
}

// 🟢 Estructura compatible con el frontend
echo json_encode([
    "success" => true,
    "questions" => $questions
], JSON_UNESCAPED_UNICODE);
?>

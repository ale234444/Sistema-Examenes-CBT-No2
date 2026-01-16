<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include __DIR__ . '/../../db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$exam_id = $_GET['exam_id'] ?? null;

if (!$exam_id) {
  echo json_encode(["success" => false, "message" => "Falta el ID del examen"]);
  exit;
}

/*
  🔥 UNIFICAR TODO:
  - Preguntas creadas con exam_id
  - Preguntas retomadas desde exam_questions
  - ORDER correcto
*/

$sql = "
(
  SELECT 
    q.id, q.texto, q.tipo, q.opciones, q.correcta, q.metadata, q.image_url,
    eq.question_order
  FROM exam_questions eq
  INNER JOIN questions q ON q.id = eq.question_id
  WHERE eq.exam_id = ?
)
UNION
(
  SELECT 
    q.id, q.texto, q.tipo, q.opciones, q.correcta, q.metadata, q.image_url,
    9999 as question_order   -- Las creadas nuevas se van al final si no tienen order
  FROM questions q
  WHERE q.exam_id = ?
)
ORDER BY question_order ASC;
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $exam_id, $exam_id);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];

while ($row = $result->fetch_assoc()) {

  // Decodificar JSON
  $opciones = json_decode($row['opciones'], true) ?: [];
  $correcta = json_decode($row['correcta'], true) ?: [];
  $metadata = json_decode($row['metadata'], true) ?: [];

  // Fix de imagen
  if (!empty($row['image_url']) && strpos($row['image_url'], "http") !== 0) {
    $row['image_url'] = "http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/" . basename($row['image_url']);
  }

  $questions[] = [
    "id" => (int)$row['id'],
    "texto" => $row["texto"],
    "tipo" => $row["tipo"],
    "opciones" => $opciones,
    "correcta" => $correcta,
    "metadata" => $metadata,
    "image_url" => $row["image_url"],
    "question_order" => (int)$row["question_order"]
  ];
}

echo json_encode([
  "success" => true,
  "questions" => $questions
], JSON_UNESCAPED_UNICODE);

$conn->close();
?>

<?php
include '../../db.php';

// ⚡ CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$student_id = $_GET['student_id'] ?? null;
$exam_id = $_GET['exam_id'] ?? null;

if (!$student_id || !$exam_id) {
    echo json_encode(['error' => 'Faltan parámetros']);
    exit;
}

if (!$conn) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

// ✅ Traer preguntas con respuestas del alumno e imagen
$sql = "
SELECT 
    q.id AS question_id,
    q.texto,
    q.metadata,
    q.correcta,
    q.image_url, -- 🖼️ agregamos la columna de imagen
    a.answer
FROM questions q
LEFT JOIN answers a 
    ON q.id = a.question_id 
    AND a.student_id = ? 
    AND a.exam_id = ?
WHERE q.exam_id = ?
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Error al preparar la consulta de preguntas', 'detalle' => $conn->error]);
    exit;
}

$stmt->bind_param("iii", $student_id, $exam_id, $exam_id);
$stmt->execute();
$result = $stmt->get_result();

$answers = [];
while ($row = $result->fetch_assoc()) {
    // 🧩 Asegurar que metadata sea siempre array
    $metadata = json_decode($row['metadata'], true);
    if (!is_array($metadata)) {
        $metadata = [];
    }

    // 🧩 Asegurar que la respuesta correcta sea texto
    $correcta_decoded = json_decode($row['correcta'], true);
    if (is_array($correcta_decoded)) {
        $correcta = $correcta_decoded[0] ?? null;
    } else {
        $correcta = $row['correcta'];
    }

    // 🧩 Agregar URL completa de la imagen
    $image_url = null;
    if (!empty($row['image_url'])) {
        $image_url = "http://192.168.100.36/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/" . basename($row['image_url']);
    }

    $answers[] = [
        'question_id' => (int)$row['question_id'],
        'texto' => $row['texto'],
        'metadata' => $metadata,
        'correcta' => $correcta,
        'answer' => $row['answer'],
        'image_url' => $image_url
    ];
}
$stmt->close();

// ✅ Traer puntaje del examen (tabla results)
$stmt2 = $conn->prepare("SELECT score FROM results WHERE student_id=? AND exam_id=?");
if (!$stmt2) {
    echo json_encode(['error' => 'Error al preparar la consulta de resultados', 'detalle' => $conn->error]);
    exit;
}
$stmt2->bind_param("ii", $student_id, $exam_id);
$stmt2->execute();
$stmt2->bind_result($score);
$stmt2->fetch();
$stmt2->close();

$score = $score ?? 0;

echo json_encode([
    'score' => (int)$score,
    'answers' => $answers
]);
?>

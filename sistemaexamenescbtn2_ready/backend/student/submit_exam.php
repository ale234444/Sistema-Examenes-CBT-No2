<?php
include '../../db.php';

// ⚡ CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$student_id = $data['student_id'] ?? null;
$exam_id = $data['exam_id'] ?? null;
$responses = $data['responses'] ?? [];

if (!$student_id || !$exam_id || !is_array($responses)) {
    echo json_encode(['error' => 'Datos incompletos o inválidos']);
    exit;
}

// ✅ Verificar si ya contestó
$stmt = $conn->prepare("SELECT COUNT(*) FROM results WHERE student_id=? AND exam_id=?");
$stmt->bind_param("ii", $student_id, $exam_id);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    echo json_encode(['error' => 'Ya contestaste este examen']);
    exit;
}

// ✅ Calcular resultados
$total_questions = count($responses);
$correct_count = 0;

foreach ($responses as $r) {
    $qId = $r['question_id'] ?? null;
    $answer = $r['answer'] ?? '';

    if (!$qId) continue;

    // Corregido: usar id en lugar de idPrimaria
    $stmt2 = $conn->prepare("SELECT correcta FROM questions WHERE id=?");
    $stmt2->bind_param("i", $qId);
    $stmt2->execute();
    $stmt2->bind_result($correcta_json);
    $stmt2->fetch();
    $stmt2->close();

    $correctas = json_decode($correcta_json, true);
    $correct_answer = is_array($correctas) && count($correctas) > 0 ? $correctas[0] : $correcta_json;

    $is_correct = (strtolower(trim($answer)) === strtolower(trim($correct_answer))) ? 1 : 0;
    if ($is_correct) $correct_count++;

    $ins = $conn->prepare("INSERT INTO answers (student_id, exam_id, question_id, answer, is_correct) VALUES (?, ?, ?, ?, ?)");
    $ins->bind_param("iiisi", $student_id, $exam_id, $qId, $answer, $is_correct);
    $ins->execute();
    $ins->close();
}

$score = ($total_questions > 0) ? round(($correct_count / $total_questions) * 100) : 0;
$insert = $conn->prepare("INSERT INTO results (student_id, exam_id, score, answers) VALUES (?, ?, ?, ?)");
$insert->bind_param("iiis", $student_id, $exam_id, $score, json_encode($responses));
$insert->execute();
$insert->close();

echo json_encode([
    'message' => 'Examen enviado correctamente',
    'score' => $score
]);
?>

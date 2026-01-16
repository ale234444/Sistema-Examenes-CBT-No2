<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$exam_id = $data["exam_id"] ?? null;
$question_id = $data["question_id"] ?? null;

if (!$exam_id || !$question_id) {
    echo json_encode(["error" => true, "message" => "Faltan parámetros"]);
    exit;
}

// Verificar si ya existe en exam_questions
$check = $conn->prepare("SELECT id FROM exam_questions WHERE exam_id = ? AND question_id = ?");
$check->bind_param("ii", $exam_id, $question_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "error" => false,
        "message" => "La pregunta ya está agregada a este examen"
    ]);
    exit;
}

// CALCULAR EL NUEVO QUESTION_ORDER
$order_sql = "SELECT COALESCE(MAX(question_order), 0) as max_order FROM exam_questions WHERE exam_id = ?";
$order_stmt = $conn->prepare($order_sql);
$order_stmt->bind_param("i", $exam_id);
$order_stmt->execute();
$order_result = $order_stmt->get_result();
$max_order = $order_result->fetch_assoc()['max_order'];
$new_order = $max_order + 1;
$order_stmt->close();

// Insertar CON QUESTION_ORDER
$stmt = $conn->prepare("INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $exam_id, $question_id, $new_order);

if ($stmt->execute()) {
    echo json_encode([
        "error" => false,
        "message" => "Pregunta agregada correctamente al examen",
        "question_order" => $new_order
    ]);
} else {
    echo json_encode([
        "error" => true,
        "message" => "Error al agregar la pregunta: " . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
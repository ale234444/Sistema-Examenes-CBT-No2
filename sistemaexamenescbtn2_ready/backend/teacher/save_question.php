<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

include_once("../db.php");

// Si la solicitud es OPTIONS, solo responder sin procesar (para evitar errores CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Obtener los datos del frontend
$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['exam_id']) ||
    !isset($data['type']) ||
    !isset($data['question_text'])
) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
    exit;
}

$exam_id = intval($data['exam_id']);
$type = $data['type'];
$question_text = $data['question_text'];

// Campos opcionales
$options = isset($data['options']) ? json_encode($data['options'], JSON_UNESCAPED_UNICODE) : null;
$correct_answers = isset($data['correct_answers']) ? json_encode($data['correct_answers'], JSON_UNESCAPED_UNICODE) : null;

// 🆕 NUEVO: Guardar columnas A y B (para relación de columnas)
$metadata = null;
if (isset($data['metadata'])) {
    $metadata = json_encode($data['metadata'], JSON_UNESCAPED_UNICODE);
}

try {
    // Iniciar transacción para asegurar que ambas inserciones se completen
    $conn->begin_transaction();
    
    // 1. Insertar en la tabla questions (SIN exam_id)
    $stmt = $conn->prepare("INSERT INTO questions (type, question_text, options, correct_answers, metadata)
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $type, $question_text, $options, $correct_answers, $metadata);

    if ($stmt->execute()) {
        $new_question_id = $conn->insert_id;
        $stmt->close();
        
        // 2. Insertar en exam_questions para relacionar con el examen
        // Calcular el order para la nueva pregunta
        $order_sql = "SELECT COALESCE(MAX(question_order), 0) as max_order FROM exam_questions WHERE exam_id = ?";
        $order_stmt = $conn->prepare($order_sql);
        $order_stmt->bind_param("i", $exam_id);
        $order_stmt->execute();
        $order_result = $order_stmt->get_result();
        $max_order = $order_result->fetch_assoc()['max_order'];
        $new_order = $max_order + 1;
        $order_stmt->close();
        
        // Insertar en exam_questions
        $stmt2 = $conn->prepare("INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)");
        $stmt2->bind_param("iii", $exam_id, $new_question_id, $new_order);
        
        if ($stmt2->execute()) {
            $conn->commit();
            echo json_encode([
                "success" => true, 
                "message" => "Pregunta guardada correctamente.",
                "question_id" => $new_question_id
            ]);
        } else {
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Error al relacionar la pregunta con el examen."]);
        }
        $stmt2->close();
    } else {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => "Error al guardar la pregunta."]);
    }
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>
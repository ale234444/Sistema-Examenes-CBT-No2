<?php
// backend/teacher/retomar_pregunta.php
header("Content-Type: application/json; charset=utf-8");
//header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Origin: http://192.168.1.94:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once(__DIR__ . '/../../db.php');

$inputJSON = file_get_contents("php://input");
$input = json_decode($inputJSON, true);

error_log("📥 INPUT JSON: " . $inputJSON);

$source_question_id = intval($input["source_question_id"] ?? 0);
$target_exam_id = intval($input["target_exam_id"] ?? 0);

if ($source_question_id <= 0 || $target_exam_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error: pregunta o examen destino no seleccionado",
        "input" => $input
    ]);
    exit;
}


try {
    // 1. Verificar que la pregunta existe
    $check_question = $conn->prepare("SELECT id FROM questions WHERE id = ?");
    $check_question->bind_param("i", $source_question_id);
    $check_question->execute();
    $question_result = $check_question->get_result();
    
    if ($question_result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "La pregunta no existe"]);
        exit;
    }
    
    // 2. Verificar que el examen destino existe
    $check_exam = $conn->prepare("SELECT id FROM exams WHERE id = ?");
    $check_exam->bind_param("i", $target_exam_id);
    $check_exam->execute();
    $exam_result = $check_exam->get_result();
    
    if ($exam_result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "El examen destino no existe"]);
        exit;
    }
    
    // 3. Verificar si la pregunta ya está en el examen (evitar duplicados)
    $check_duplicate = $conn->prepare("SELECT id FROM exam_questions WHERE exam_id = ? AND question_id = ?");
    $check_duplicate->bind_param("ii", $target_exam_id, $source_question_id);
    $check_duplicate->execute();
    $duplicate_result = $check_duplicate->get_result();
    
   if ($duplicate_result->num_rows > 0) {
    // devuelve success true para hacer la operación idempotente (ya existe)
    echo json_encode(["success" => true, "message" => "La pregunta ya estaba en el examen (no se duplicó)."]);
    exit;
}

    
    // 4. Calcular el order para la nueva pregunta
    $get_max_order = $conn->prepare("SELECT COALESCE(MAX(question_order), 0) as max_order FROM exam_questions WHERE exam_id = ?");
    $get_max_order->bind_param("i", $target_exam_id);
    $get_max_order->execute();
    $order_result = $get_max_order->get_result();
    $max_order = $order_result->fetch_assoc()['max_order'];
    $new_order = $max_order + 1;
    
    // 5. Insertar en exam_questions
    $sql_insert = "INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    
    if (!$stmt_insert) {
        throw new Exception("Error preparando inserción: " . $conn->error);
    }
    
    $stmt_insert->bind_param("iii", $target_exam_id, $source_question_id, $new_order);
    
    if ($stmt_insert->execute()) {
        $new_relation_id = $conn->insert_id;
        error_log("✅ PREGUNTA AGREGADA AL EXAMEN - Relation ID: $new_relation_id, Exam: $target_exam_id, Question: $source_question_id, Order: $new_order");
        
        echo json_encode([
            "success" => true, 
            "message" => "Pregunta agregada al examen correctamente",
            "relation_id" => $new_relation_id,
            "question_order" => $new_order
        ]);
    } else {
        error_log("❌ ERROR INSERT EXAM_QUESTIONS: " . $conn->error);
        echo json_encode([
            "success" => false, 
            "message" => "Error al agregar pregunta al examen: " . $conn->error
        ]);
    }
    
    // Cerrar statements
    $check_question->close();
    $check_exam->close();
    $check_duplicate->close();
    $get_max_order->close();
    $stmt_insert->close();
    
} catch (Exception $e) {
    error_log("❌ EXCEPCIÓN: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Error: " . $e->getMessage()
    ]);
}

$conn->close();
?>
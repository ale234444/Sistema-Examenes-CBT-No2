<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../../db.php';

// LEER DATOS
$data = json_decode(file_get_contents("php://input"), true);

$titulo = $data['titulo'] ?? '';
$descripcion = $data['descripcion'] ?? '';
$enabled = intval($data['enabled'] ?? 1);
$publish_date = $data['publish_date'] ?? date('Y-m-d H:i:s');

$teacher_id = intval($data['teacher_id'] ?? 0);
$grade_id   = intval($data['grade_id'] ?? 0);
$group_id   = intval($data['group_id'] ?? 0);
$career     = $data['career'] ?? null;

$time_limit = isset($data['time_limit']) ? intval($data['time_limit']) : null;

// VALIDAR
if (!$titulo || !$descripcion || !$teacher_id || !$grade_id || !$group_id || !$career) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// INSERTAR EXAMEN
$stmt = $conn->prepare("INSERT INTO exams 
    (titulo, descripcion, enabled, publish_date, grade_id, group_id, teacher_id, time_limit, career)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssisiiiss",
    $titulo,
    $descripcion,
    $enabled,
    $publish_date,
    $grade_id,
    $group_id,
    $teacher_id,
    $time_limit,
    $career
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Examen creado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

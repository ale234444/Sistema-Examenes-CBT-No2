<?php
include '../../db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔹 Obtener parámetros
$grade_id = isset($_GET['grade_id']) ? $_GET['grade_id'] : '';
$group_id = isset($_GET['group_id']) ? $_GET['group_id'] : '';
$career   = isset($_GET['career']) ? $_GET['career'] : ''; // NUEVO

if (empty($grade_id) || empty($group_id) || empty($career)) {
    echo json_encode(['success' => false, 'message' => 'Faltan parámetros (grade_id, group_id o career)']);
    exit;
}

// 🔹 Consulta filtrando también por carrera
$stmt = $conn->prepare("
    SELECT 
        id AS id,
        titulo,
        descripcion,
        publish_date,
        grade_id,
        group_id,
        teacher_id,
        enabled,
        time_limit,
        career
    FROM exams 
    WHERE enabled = 1 
      AND grade_id = ? 
      AND group_id = ? 
      AND career = ?
    ORDER BY publish_date DESC
");

// 🔹 bind_param: grade_id y group_id como enteros, career como string
$stmt->bind_param("iis", $grade_id, $group_id, $career);
$stmt->execute();
$result = $stmt->get_result();

$exams = [];
while ($row = $result->fetch_assoc()) {
    $exams[] = $row;
}

echo json_encode([
    'success' => true,
    'exams' => $exams
]);
?>

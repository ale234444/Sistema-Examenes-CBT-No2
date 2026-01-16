<?php
include '../../db.php';

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : null;

if (!$teacher_id) {
    echo json_encode([]);
    exit;
}

// Traer solo los exámenes creados por este docente
$stmt = $conn->prepare("
    SELECT * 
    FROM exams
    WHERE teacher_id = ?
    ORDER BY id DESC
");
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$res = $stmt->get_result();
$exams = $res->fetch_all(MYSQLI_ASSOC);

echo json_encode($exams);
?>

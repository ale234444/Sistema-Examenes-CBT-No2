<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once("../../db.php");

$student_id = $_GET['student_id'] ?? null;

if (!$student_id) {
    echo json_encode(["success" => false, "message" => "Falta el ID del estudiante"]);
    exit;
}

// Obtener semestre, grupo y carrera del estudiante
$query = "SELECT semester, group_name, career FROM users WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc();

if (!$student) {
    echo json_encode(["success" => false, "message" => "Estudiante no encontrado"]);
    exit;
}

$grade_id = intval($student['semester']);
$career = $student['career'];

// Extraer solo el número del grupo desde group_name
preg_match('/\d+/', $student['group_name'], $m);
$group_id = isset($m[0]) ? intval($m[0]) : 0;

// Buscar exámenes por semestre + grupo + carrera
$query = "SELECT id, titulo, descripcion, publish_date, time_limit
          FROM exams
          WHERE grade_id = ? 
            AND group_id = ? 
            AND (career = ? OR career IS NULL)
            AND enabled = 1";


$stmt = $conn->prepare($query);
$stmt->bind_param("iis", $grade_id, $group_id, $career);
$stmt->execute();
$result = $stmt->get_result();

$exams = [];
while ($row = $result->fetch_assoc()) {
    $exams[] = $row;
}

echo json_encode(["success" => true, "exams" => $exams]);
?>

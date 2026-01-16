<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../../db.php';

$stmt = $conn->prepare("SELECT id, nombre, grade_id FROM student_groups");
$stmt->execute();
$res = $stmt->get_result();
$groups = $res->fetch_all(MYSQLI_ASSOC);

echo json_encode($groups);
?>

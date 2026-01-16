<?php
include '../../db.php'; 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$grade_id = $_GET['grade_id'] ?? 0;

$stmt = $conn->prepare("SELECT id, nombre FROM student_groups WHERE grade_id=?");
$stmt->bind_param("i", $grade_id);
$stmt->execute();
$res = $stmt->get_result();
$groups = $res->fetch_all(MYSQLI_ASSOC);

echo json_encode($groups);

?>

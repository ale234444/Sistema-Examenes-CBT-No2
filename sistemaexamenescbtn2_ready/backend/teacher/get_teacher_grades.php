<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include '../../db.php';

$teacher_id = intval($_GET['teacher_id'] ?? 0);
if ($teacher_id <= 0) {
    echo json_encode([]);
    exit;
}

// traer grades distintos vinculados al docente
$sql = "SELECT DISTINCT g.id, g.nombre
        FROM grades g
        JOIN teacher_assignments ta ON ta.grade_id = g.id
        WHERE ta.teacher_id = ?
        ORDER BY g.id";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$res = $stmt->get_result();
$grades = $res->fetch_all(MYSQLI_ASSOC);
echo json_encode($grades);
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include '../../db.php';

$teacher_id = intval($_GET['teacher_id'] ?? 0);
$grade_id = intval($_GET['grade_id'] ?? 0);
if ($teacher_id <= 0 || $grade_id <= 0) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT sg.id, sg.nombre
        FROM student_groups sg
        JOIN teacher_assignments ta ON ta.group_id = sg.id AND ta.grade_id = sg.grade_id
        WHERE ta.teacher_id = ? AND ta.grade_id = ?
        ORDER BY sg.id";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $teacher_id, $grade_id);
$stmt->execute();
$res = $stmt->get_result();
$groups = $res->fetch_all(MYSQLI_ASSOC);
echo json_encode($groups);
?>

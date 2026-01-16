<?php
include '../../db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);
$exam_id = $data['exam_id'] ?? null;

if (!$exam_id) {
    echo json_encode(['error'=>'Exam ID missing']);
    exit;
}

$stmt = $conn->prepare("UPDATE exams SET enabled=1 WHERE id=?");
$stmt->execute([$exam_id]);

echo json_encode(['success'=>true]);

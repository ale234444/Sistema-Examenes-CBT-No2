<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include '../../db.php'; 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = file_get_contents("php://input");
$data = json_decode($input);

$username = $data->username ?? '';
$matricula = $data->matricula ?? '';
$password = $data->password ?? '';
$role = $data->role ?? '';
$grade_id = $data->grade_id ?? null;
$group_id = $data->group_id ?? null;

if (!$username || !$matricula || !$password || !$role) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

// Para alumnos, validar que haya grado y grupo
if ($role === "ROLE_STUDENT" && (!$grade_id || !$group_id)) {
    echo json_encode(["success" => false, "message" => "Alumno debe tener grado y grupo"]);
    exit;
}

// Insertar usuario
$stmt = $conn->prepare("
    INSERT INTO users (username, matricula, password, role, grade_id, group_id)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssii",
    $username,
    $matricula,
    $password,
    $role,
    $grade_id,
    $group_id
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario creado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al crear usuario: " . $stmt->error]);
}
?>

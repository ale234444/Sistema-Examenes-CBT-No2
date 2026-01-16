<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// 🔗 Conexión con la base de datos
include __DIR__ . "/../../db.php";

// 🧩 Manejo del preflight de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 📥 Recibir datos JSON desde frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "❌ No se recibieron datos JSON válidos."]);
    exit;
}

$username   = trim($data['username'] ?? '');
$matricula  = trim($data['matricula'] ?? '');
$password   = trim($data['password'] ?? '');
$role       = trim($data['role'] ?? '');
$semester   = trim($data['semester'] ?? '');
$group_name = trim($data['group_name'] ?? '');

// ⚠️ Validar campos obligatorios
if (!$username || !$matricula || !$password || !$role) {
    echo json_encode(["success" => false, "message" => "⚠️ Faltan datos obligatorios"]);
    exit;
}

// 🔎 Verificar si la matrícula ya existe
$check = $conn->prepare("SELECT id FROM users WHERE matricula = ?");
$check->bind_param("s", $matricula);
$check->execute();
$result = $check->get_result();

if ($result && $result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ La matrícula '$matricula' ya está registrada."
    ]);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

// 🚫 Guardar contraseña sin encriptar
$sql = "INSERT INTO users (matricula, password, role, username, semester, group_name)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al preparar la consulta SQL",
        "error" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("ssssss", $matricula, $password, $role, $username, $semester, $group_name);

// 🧾 Ejecutar
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "✅ Usuario registrado correctamente (contraseña sin encriptar)"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al insertar en la base de datos",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>

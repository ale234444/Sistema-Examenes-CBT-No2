<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . "/../../db.php"; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

$data = json_decode(file_get_contents("php://input"), true);

$matricula = trim($data["matricula"] ?? '');
$password = trim($data["password"] ?? '');

if (empty($matricula) || empty($password)) {
    echo json_encode(["success" => false, "message" => "⚠️ Faltan credenciales"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE matricula = ?");
$stmt->bind_param("s", $matricula);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(["success" => false, "message" => "❌ Usuario no encontrado"]);
    exit;
}

// ✅ Verificar contraseña encriptada o texto plano
$isValid = false;

if (password_verify($password, $user["password"])) {
    $isValid = true;
} elseif ($password === $user["password"]) {
    // Compatibilidad por si hay contraseñas viejas sin hash
    $isValid = true;
}

if ($isValid) {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user["id"],
            "matricula" => $user["matricula"],
            "username" => $user["username"],
            "role" => $user["role"],
            "semester" => $user["semester"],
            "group_name" => $user["group_name"]
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Credenciales inválidas"]);
}

$stmt->close();
$conn->close();
?>

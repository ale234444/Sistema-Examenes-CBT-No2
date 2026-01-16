<?php
// admin/update_user.php
include '../../db.php';

// Configuración de CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$id        = $data['id'] ?? null;
$username  = $data['username'] ?? null;
$matricula = $data['matricula'] ?? null;
$password  = $data['password'] ?? null;
$role      = $data['role'] ?? null;
$semester  = $data['semestre'] ?? null;
$group_name = $data['grupo'] ?? null;

if (!$id || !$username || !$matricula || !$role) {
    echo json_encode(["success" => false, "message" => "Campos requeridos faltantes."]);
    exit;
}

try {
    $conn->begin_transaction();

    // Si se envía una nueva contraseña, la actualiza; si no, la mantiene igual
    if (!empty($password)) {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("
            UPDATE users 
            SET username=?, matricula=?, password=?, role=?, semester=?, group_name=?
            WHERE idPrimaria=?
        ");
        $stmt->bind_param("ssssssi", $username, $matricula, $hashed, $role, $semester, $group_name, $id);
    } else {
        $stmt = $conn->prepare("
            UPDATE users 
            SET username=?, matricula=?, role=?, semester=?, group_name=?
            WHERE idPrimaria=?
        ");
        $stmt->bind_param("sssssi", $username, $matricula, $role, $semester, $group_name, $id);
    }

    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar usuario: " . $stmt->error);
    }

    $stmt->close();
    $conn->commit();

    echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente."]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>

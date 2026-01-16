<?php
// admin/delete_user.php
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

$user_id = $data['id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "ID de usuario requerido."]);
    exit;
}

try {
    $conn->begin_transaction();

    // Eliminar asignaciones si es docente
    $conn->query("DELETE FROM teacher_assignments WHERE teacher_id = $user_id");

    // Eliminar usuario
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    if (!$stmt->execute()) {
        throw new Exception("Error al eliminar usuario: " . $stmt->error);
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Usuario eliminado correctamente."]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>

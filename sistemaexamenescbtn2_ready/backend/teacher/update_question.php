<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../db.php';

// ==== CORS ====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// =============================================================
// 🧩 CASO 1: viene como multipart/form-data (con imagen)
// =============================================================
if (!empty($_FILES) || isset($_POST['id'])) {
    $id = $_POST['id'] ?? 0;
    $texto = $_POST['texto'] ?? '';
    $tipo = $_POST['tipo'] ?? '';
    $correct_answer = $_POST['correct_answer'] ?? '';
    $metadata = $_POST['metadata'] ?? '';
    $options = $_POST['options'] ?? [];

    if (!$id || !$texto || !$tipo) {
        echo json_encode(["success" => false, "message" => "Faltan datos obligatorios"]);
        exit;
    }

    // 🖼️ Procesar nueva imagen si se envió
    $image_url = $_POST['existing_image'] ?? null; // en caso de mantener la imagen actual
    if (!empty($_FILES['image']['name'])) {
        $upload_dir = "../../uploads/questions/";
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_name = uniqid("question_") . "_" . basename($_FILES["image"]["name"]);
        $target_file = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $fileUrl = "http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/" . $newName;
        } else {
            echo json_encode(["success" => false, "message" => "Error al subir la imagen"]);
            exit;
        }
    }

    // 🔸 Convertir datos a JSON si es necesario
    $metadata_json = is_array($metadata) ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : $metadata;
    $options_json = is_array($options) ? json_encode($options, JSON_UNESCAPED_UNICODE) : json_encode([]);
    $correcta_json = is_array($correct_answer) ? json_encode($correct_answer, JSON_UNESCAPED_UNICODE) : json_encode([$correct_answer]);

    // ✅ Actualizar pregunta
    $stmt = $conn->prepare("UPDATE questions 
                            SET texto=?, tipo=?, opciones=?, correcta=?, metadata=?, image_url=? 
                            WHERE id=?");
    $stmt->bind_param("ssssssi", $texto, $tipo, $options_json, $correcta_json, $metadata_json, $image_url, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Pregunta actualizada correctamente con imagen"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar: " . $stmt->error]);
    }
    exit;
}

// =============================================================
// 🧩 CASO 2: viene como JSON (sin imagen)
// =============================================================
$input = file_get_contents("php://input");
if (!$input) {
    echo json_encode(["success" => false, "message" => "No se recibió contenido en la solicitud"]);
    exit;
}

$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "JSON inválido o malformado"]);
    exit;
}

$id = $data['id'] ?? 0;
$texto = $data['texto'] ?? '';
$tipo = $data['tipo'] ?? '';
$correct_answer = $data['correct_answer'] ?? '';
$metadata = $data['metadata'] ?? '';
$options = $data['options'] ?? [];
$image_url = $data['image_url'] ?? null;

if (!$id || !$texto || !$tipo) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios (id, texto o tipo)"]);
    exit;
}

// 🔸 Asegurar formatos válidos
$metadata_json = is_array($metadata) ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : $metadata;
$options_json = is_array($options) ? json_encode($options, JSON_UNESCAPED_UNICODE) : json_encode([]);
$correcta_json = is_array($correct_answer) ? json_encode($correct_answer, JSON_UNESCAPED_UNICODE) : json_encode([$correct_answer]);

// ✅ Actualizar en base de datos
$stmt = $conn->prepare("UPDATE questions 
                        SET texto=?, tipo=?, opciones=?, correcta=?, metadata=?, image_url=? 
                        WHERE id=?");
$stmt->bind_param("ssssssi", $texto, $tipo, $options_json, $correcta_json, $metadata_json, $image_url, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Pregunta actualizada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $stmt->error]);
}
?>

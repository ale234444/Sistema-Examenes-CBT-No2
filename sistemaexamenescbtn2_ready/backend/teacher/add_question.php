<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../db.php';

// 🔹 CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 🔍 Log inicial
error_log("🟢 add_question.php iniciado - Método: " . $_SERVER['REQUEST_METHOD']);
error_log("🟢 POST recibido: " . print_r($_POST, true));
error_log("🟢 FILES recibidos: " . print_r($_FILES, true));

// ====================================================================
// 🧩 CASO 1: cuando viene como multipart/form-data (con imagen subida)
// ====================================================================
if (!empty($_FILES) || isset($_POST['exam_id'])) {
    error_log("🟢 Entró al bloque multipart/form-data");

    $exam_id = $_POST['exam_id'] ?? 0;
    $texto = $_POST['texto'] ?? '';
    $tipo = $_POST['tipo'] ?? '';
    $correct_answer = $_POST['correct_answer'] ?? '';
    $metadata = $_POST['metadata'] ?? '';
    $options = $_POST['options'] ?? [];

    if (!$exam_id || !$texto || !$tipo) {
        error_log("❌ Faltan datos obligatorios");
        echo json_encode(["success" => false, "message" => "Faltan datos obligatorios"]);
        exit;
    }

    // 🖼️ Procesar imagen si existe
    $image_url = null;

    // aceptar tanto "imagen" como "image"
    if (!empty($_FILES['imagen']['name']) || !empty($_FILES['image']['name'])) {
        $fileField = isset($_FILES['imagen']) ? 'imagen' : 'image';
        error_log("🟢 Se detectó imagen: " . $_FILES[$fileField]['name']);

        // ruta universal compatible con Windows/Linux
        $upload_dir = realpath(__DIR__ . "/../../uploads/questions/");
        if ($upload_dir === false) {
            $upload_dir = __DIR__ . "/../../uploads/questions/";
        }
        $upload_dir = rtrim($upload_dir, "/\\") . "/";

        error_log("📂 Ruta de subida: " . $upload_dir);

        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
            error_log("📁 Carpeta creada: " . $upload_dir);
        }

       $ext = pathinfo($_FILES[$fileField]["name"], PATHINFO_EXTENSION);
$file_name = uniqid("question_") . "." . strtolower($ext);

        $target_file = $upload_dir . $file_name;
        error_log("📄 Archivo destino: " . $target_file);

        if (move_uploaded_file($_FILES[$fileField]["tmp_name"], $target_file)) {
            
            
            $image_url = "http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/" . $file_name;

            
            error_log("✅ Imagen subida correctamente: " . $image_url);
        } else {
            error_log("❌ Error al mover el archivo: " . $_FILES[$fileField]["tmp_name"]);
            echo json_encode(["success" => false, "message" => "❌ Error al subir la imagen"]);
            exit;
        }
    } else {
        error_log("⚠️ No se recibió ninguna imagen (campo 'imagen' o 'image' vacío o no enviado)");
    }

    // 🔸 Asegurar formatos válidos
    $metadata_json = is_array($metadata) ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : $metadata;
    $options_json = is_array($options) ? json_encode($options, JSON_UNESCAPED_UNICODE) : json_encode([]);
    $correcta_json = is_array($correct_answer) ? json_encode($correct_answer, JSON_UNESCAPED_UNICODE) : json_encode([$correct_answer]);

    // 🧠 Guardar pregunta en BD
    $stmt = $conn->prepare("INSERT INTO questions (exam_id, tipo, texto, opciones, correcta, metadata, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $exam_id, $tipo, $texto, $options_json, $correcta_json, $metadata_json, $image_url);

    if ($stmt->execute()) {
        error_log("✅ Pregunta insertada correctamente con imagen");
        echo json_encode(["success" => true, "message" => "✅ Pregunta agregada correctamente con imagen"]);
    } else {
        error_log("❌ Error SQL: " . $stmt->error);
        echo json_encode(["success" => false, "message" => "❌ Error al insertar: " . $stmt->error]);
    }
    exit;
}

// ====================================================================
// 🧩 CASO 2: cuando viene como JSON (sin imagen)
// ====================================================================
$input = file_get_contents("php://input");
if (!$input) {
    error_log("❌ No se recibió contenido JSON");
    echo json_encode(["success" => false, "message" => "No se recibió contenido"]);
    exit;
}

$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("❌ JSON inválido recibido");
    echo json_encode(["success" => false, "message" => "JSON inválido"]);
    exit;
}

error_log("🟢 Entró al bloque JSON sin imagen: " . print_r($data, true));

$exam_id = $data['exam_id'] ?? 0;
$texto = $data['texto'] ?? '';
$tipo = $data['tipo'] ?? '';
$correct_answer = $data['correct_answer'] ?? '';
$metadata = $data['metadata'] ?? '';
$options = $data['options'] ?? [];

if (!$exam_id || !$texto || !$tipo) {
    error_log("❌ Faltan datos obligatorios en JSON");
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios"]);
    exit;
}

$metadata_json = is_array($metadata) ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : $metadata;
$options_json = is_array($options) ? json_encode($options, JSON_UNESCAPED_UNICODE) : json_encode([]);
$correcta_json = is_array($correct_answer) ? json_encode($correct_answer, JSON_UNESCAPED_UNICODE) : json_encode([$correct_answer]);

$stmt = $conn->prepare("INSERT INTO questions (exam_id, tipo, texto, opciones, correcta, metadata, image_url) VALUES (?, ?, ?, ?, ?, ?, NULL)");
$stmt->bind_param("isssss", $exam_id, $tipo, $texto, $options_json, $correcta_json, $metadata_json);

if ($stmt->execute()) {
    error_log("✅ Pregunta insertada correctamente (sin imagen)");
    echo json_encode(["success" => true, "message" => "✅ Pregunta agregada correctamente (sin imagen)"]);
} else {
    error_log("❌ Error SQL (sin imagen): " . $stmt->error);
    echo json_encode(["success" => false, "message" => "❌ Error al insertar: " . $stmt->error]);
}
?>

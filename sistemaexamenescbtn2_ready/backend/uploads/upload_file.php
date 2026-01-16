<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../db.php';

// ==== CORS ====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validar archivo
if (!isset($_FILES['file'])) {
    echo json_encode(["success" => false, "message" => "No se recibió ningún archivo"]);
    exit;
}

$file = $_FILES['file'];

// 📂 Guardar FUERA del backend (ruta correcta)
$targetDir = __DIR__ . "/../../uploads/questions/"; 

if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// 🧹 Limpiar nombre
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$newName = uniqid("question_") . "." . $ext;
$targetPath = $targetDir . $newName;

// Mover archivo
if (move_uploaded_file($file['tmp_name'], $targetPath)) {

    // 🖼️ URL pública correcta
   $fileUrl = "http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/" . $newName;

    echo json_encode([
        "success" => true,
        "message" => "Archivo subido correctamente",
        "url" => $fileUrl
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al mover archivo"]);
}
?>

<?php
// backend/teacher/import_questions.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once __DIR__ . "/../../db.php";

if (!isset($_POST['exam_id'])) {
    echo json_encode(['success'=>false,'message'=>'Falta exam_id']);
    exit;
}
$exam_id = intval($_POST['exam_id']);
if ($exam_id <= 0) {
    echo json_encode(['success'=>false,'message'=>'exam_id inválido']);
    exit;
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success'=>false,'message'=>'No se recibió archivo']);
    exit;
}

$allowed = ['text/csv','application/vnd.ms-excel','text/plain'];
$mime = $_FILES['file']['type'] ?? '';
$tmp  = $_FILES['file']['tmp_name'];

if (!is_uploaded_file($tmp)) {
    echo json_encode(['success'=>false,'message'=>'Error al subir archivo']);
    exit;
}

// Abrir CSV (asumimos UTF-8). Si vienen con BOM lo eliminamos.
$handle = fopen($tmp, "r");
if ($handle === false) {
    echo json_encode(['success'=>false,'message'=>'No se pudo abrir el archivo']);
    exit;
}

// Leer encabezados
$headers = fgetcsv($handle, 0, ",");
if ($headers === false) {
    echo json_encode(['success'=>false,'message'=>'CSV vacío o inválido']);
    exit;
}

// Normalizar nombres de columnas (minúsculas, sin espacios)
$cols = array_map(function($h){ return strtolower(trim($h)); }, $headers);

// Mapeo para índices
$idx = [];
foreach ($cols as $i => $c) $idx[$c] = $i;

$inserted = 0;
$rows = 0;
$errors = [];

// Preparar statement — asumiendo tabla questions (exam_id, tipo, texto, opciones, correcta, metadata, image_url)
$stmt = $conn->prepare("INSERT INTO questions (exam_id, tipo, texto, opciones, correcta, metadata, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success'=>false,'message'=>'Error preparando la consulta: '.$conn->error]);
    exit;
}

while (($data = fgetcsv($handle, 0, ",")) !== false) {
    $rows++;
    // Leer campos seguros
    $tipo = $idx['tipo'] ?? null ? trim($data[$idx['tipo']]) : '';
    $texto = $idx['texto'] ?? null ? trim($data[$idx['texto']]) : '';
    $opciones_raw = ($idx['opciones'] ?? null) ? trim($data[$idx['opciones']]) : '';
    $correcta = ($idx['correcta'] ?? null) ? trim($data[$idx['correcta']]) : '';
    $metadata_raw = ($idx['metadata'] ?? null) ? trim($data[$idx['metadata']]) : '';
    $image_url = ($idx['image_url'] ?? null) ? trim($data[$idx['image_url']]) : '';

    if ($tipo === '' || $texto === '') {
        $errors[] = "Fila $rows: falta tipo o texto";
        continue;
    }

    // Normalizar opciones: del pipe "|" a JSON array
    $opciones = null;
    if ($opciones_raw !== '') {
        $parts = array_map('trim', explode('|', $opciones_raw));
        $opciones = json_encode($parts, JSON_UNESCAPED_UNICODE);
    } else {
        $opciones = json_encode([]);
    }

    // metadata: si es JSON válido lo usamos, si no intentamos convertir (ej. columnas separadas)
    $metadata = null;
    if ($metadata_raw !== '') {
        $decoded = json_decode($metadata_raw, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $metadata = json_encode($decoded, JSON_UNESCAPED_UNICODE);
        } else {
            // intentar interpretar como pipe (opcional)
            $metadata = json_encode($metadata_raw, JSON_UNESCAPED_UNICODE);
        }
    } else {
        $metadata = json_encode(new stdClass()); // objeto vacío
    }

    // correcta: guardamos como JSON si es array, o string
    $correcta_for_db = json_encode($correcta, JSON_UNESCAPED_UNICODE);

    // bind y execute
    $stmt->bind_param("issssss", $exam_id, $tipo, $texto, $opciones, $correcta_for_db, $metadata, $image_url);
    if ($stmt->execute()) {
        $inserted++;
    } else {
        $errors[] = "Fila $rows: error BD: " . $stmt->error;
    }
}

fclose($handle);
$stmt->close();

echo json_encode([
    'success' => true,
    'message' => "Importación finalizada",
    'rows_processed' => $rows,
    'inserted' => $inserted,
    'errors' => $errors
], JSON_UNESCAPED_UNICODE);

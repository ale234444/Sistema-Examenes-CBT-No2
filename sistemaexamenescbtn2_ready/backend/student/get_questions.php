<?php
include '../../db.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$exam_id = $_GET['exam_id'] ?? 0;



if (!$exam_id) {
    echo json_encode(["success" => false, "message" => "No exam_id provided"]);
    exit;
}

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}


// ================================
//  VALIDAR SI EL EXAMEN ESTÁ ACTIVO
// ================================
$checkExam = $conn->prepare("SELECT is_enabled FROM exams WHERE id = ?");
$checkExam->bind_param("i", $exam_id);
$checkExam->execute();
$examResult = $checkExam->get_result()->fetch_assoc();

if (!$examResult || intval($examResult['is_enabled']) === 1) {
    echo json_encode([
        "success" => false,
        "message" => "El examen no está habilitado por el docente"
    ]);
    exit;
}


/* ============================================================
   🔥 NUEVO: TRAER TAMBIÉN LAS PREGUNTAS RETOMADAS
   ============================================================ */
$query = "
(
    SELECT 
        q.id,
        q.exam_id,
        q.tipo,
        q.texto,
        q.opciones,
        q.correcta,
        q.metadata,
        q.image_url
    FROM questions q 
    WHERE q.exam_id = ?
)
UNION
(
    SELECT 
        q.id,
        q.exam_id,
        q.tipo,
        q.texto,
        q.opciones,
        q.correcta,
        q.metadata,
        q.image_url
    FROM exam_questions eq
    INNER JOIN questions q ON q.id = eq.question_id
    WHERE eq.exam_id = ?
)
";

$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $exam_id, $exam_id);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];

while ($row = $result->fetch_assoc()) {

    /* ---------------------------------------------
       🧩 Decodificar opciones y respuestas
    --------------------------------------------- */
    $row['opciones'] = json_decode($row['opciones'] ?? "[]", true);
    if (!is_array($row['opciones'])) $row['opciones'] = [];

// 🔀 Mezclar incisos si existen
if (!empty($row['opciones']) && is_array($row['opciones'])) {
    shuffle($row['opciones']);
}



    $row['correcta'] = json_decode($row['correcta'] ?? "[]", true);
    if (!is_array($row['correcta'])) $row['correcta'] = [];


    // 🔀 Mezclar los incisos (opciones) si existen
if (isset($row['opciones']) && is_array($row['opciones'])) {
    shuffle($row['opciones']);
}


    /* ---------------------------------------------
       🧠 Normalizar metadata
    --------------------------------------------- */
    $meta = $row['metadata'] ?? [];
    if (is_string($meta)) {
        $decoded = json_decode($meta, true);
        if (json_last_error() === JSON_ERROR_NONE) $meta = $decoded;
    }

    if (is_array($meta) && isset($meta['columnaA']) && isset($meta['columnaB'])) {
        $row['metadata'] = [
            'columnaA' => $meta['columnaA'],
            'columnaB' => $meta['columnaB']
        ];
    } elseif (is_array($meta) && isset($meta['opciones']) && is_array($meta['opciones'])) {
        $row['metadata'] = $meta['opciones'];
    } else {
        if (!is_array($meta)) $meta = [];
        if (empty($meta)) $meta = $row['opciones'];
        $row['metadata'] = $meta;
    }

    /* ---------------------------------------------
       🖼️ Fix de imagen
    --------------------------------------------- */
    if (!empty($row['image_url'])) {
        $filename = basename($row['image_url']);
        $serverPath = __DIR__ . "/../../uploads/questions/" . $filename;

        if (!file_exists($serverPath)) {
            $serverPath = __DIR__ . "/../../../uploads/questions/" . $filename;
        }

        if (file_exists($serverPath)) {
            $row['image_url'] = "http://localhost/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/" . rawurlencode($filename);
        } else {
            $row['image_url'] = null;
        }
    } else {
        $row['image_url'] = null;
    }

    $questions[] = $row;
}

/* ============================================================
   🧹 Quitar duplicados por ID (posible por UNION)
   ============================================================ */
$questions = array_values(array_unique($questions, SORT_REGULAR));

/* ============================================================
   🔀 Mezclar aleatoriamente las preguntas
   ============================================================ */
shuffle($questions);

/* ============================================================
   🔢 Limitar número máximo (tu regla original)
   ============================================================ */
$maxQuestions = 10;
$questions = array_slice($questions, 0, $maxQuestions);

echo json_encode([
    "success" => true,
    "questions" => $questions
], JSON_UNESCAPED_UNICODE);
?>

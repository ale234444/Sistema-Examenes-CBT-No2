<?php
// backend/teacher/get_results.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// --- incluir db.php (intenta varias rutas)
$included = false;
$try_paths = [
    __DIR__ . "/../db.php",
    __DIR__ . "/../../db.php",
    __DIR__ . "/db.php",
    __DIR__ . "/../config/db.php",
];
foreach ($try_paths as $p) {
    if (file_exists($p)) {
        include_once $p;
        $included = true;
        break;
    }
}
if (!$included) {
    echo json_encode(["error" => "No se encontró db.php.", "checked_paths" => $try_paths], JSON_UNESCAPED_UNICODE);
    exit;
}
if (!isset($conn) || !($conn instanceof mysqli)) {
    echo json_encode(["error" => "Conexión \$conn no válida en db.php."], JSON_UNESCAPED_UNICODE);
    exit;
}

// Helper: verificar existencia de columna en una tabla
function columnExists($conn, $table, $column) {
    $res = $conn->query("SELECT DATABASE() AS db");
    if (!$res) return false;
    $row = $res->fetch_assoc();
    $db = $row['db'] ?? null;
    $res->free();
    if (!$db) return false;
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS c
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
    ");
    if (!$stmt) return false;
    $stmt->bind_param("sss", $db, $table, $column);
    $stmt->execute();
    $r = $stmt->get_result();
    $exists = false;
    if ($r) {
        $row = $r->fetch_assoc();
        $exists = intval($row['c'] ?? 0) > 0;
        $r->free();
    }
    $stmt->close();
    return $exists;
}

// Recibir parámetros: teacher_id (OBLIGATORIO), exam_id (opcional)
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : (isset($_POST['teacher_id']) ? intval($_POST['teacher_id']) : 0);
$exam_id = isset($_GET['exam_id']) ? intval($_GET['exam_id']) : (isset($_POST['exam_id']) ? intval($_POST['exam_id']) : 0);

if ($teacher_id <= 0) {
    echo json_encode(["success" => false, "message" => "Falta teacher_id"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Tablas
$usersTable = 'users';
$examsTable = 'exams';
$resultsTable = 'results';

// Column candidates
$userCols = ['nombre', 'name', 'username'];
$examCols = ['titulo', 'title', 'nombre', 'name'];
$resultScoreCols = ['score', 'calificacion', 'score_value'];
$resultDateCols = ['fecha', 'created_at', 'date', 'created'];
$examPkCandidates = ['idPrimaria', 'id']; // checar cuál existe

// Elegir columnas disponibles
$foundUserCol = null;
foreach ($userCols as $c) { if (columnExists($conn, $usersTable, $c)) { $foundUserCol = $c; break; } }
$foundExamCol = null;
foreach ($examCols as $c) { if (columnExists($conn, $examsTable, $c)) { $foundExamCol = $c; break; } }
$foundScoreCol = null;
foreach ($resultScoreCols as $c) { if (columnExists($conn, $resultsTable, $c)) { $foundScoreCol = $c; break; } }
$foundDateCol = null;
foreach ($resultDateCols as $c) { if (columnExists($conn, $resultsTable, $c)) { $foundDateCol = $c; break; } }

// Detectar PK real de exams (idPrimaria o id)
$foundExamPk = null;
foreach ($examPkCandidates as $p) { if (columnExists($conn, $examsTable, $p)) { $foundExamPk = $p; break; } }
if (!$foundExamPk) {
    // fallback - intentar usar 'id'
    $foundExamPk = 'id';
}

// SELECTs seguros
$userSelect = $foundUserCol ? "COALESCE(u.`{$foundUserCol}`, u.`username`, 'Sin nombre')" : "COALESCE(u.`username`, 'Sin nombre')";
$examSelect = $foundExamCol ? "COALESCE(e.`{$foundExamCol}`, 'Sin título') AS examen" : "'Sin título' AS examen";
$scoreSelect = $foundScoreCol ? "r.`{$foundScoreCol}` AS calificacion" : "NULL AS calificacion";
$dateSelect = $foundDateCol ? "COALESCE(r.`{$foundDateCol}`, NOW()) AS fecha" : "NOW() AS fecha";

// Construir SQL con filtro por teacher_id (y opcional exam_id)
$sql = "
    SELECT
        {$userSelect} AS alumno,
        {$examSelect},
        {$scoreSelect},
        {$dateSelect},
        r.*,
        e.`{$foundExamPk}` AS exam_pk
    FROM `{$resultsTable}` r
    LEFT JOIN `{$usersTable}` u ON r.student_id = u.id
    INNER JOIN `{$examsTable}` e ON r.exam_id = e.`{$foundExamPk}`
    WHERE e.teacher_id = ?
";

$params = [$teacher_id];
$param_types = "i";

if ($exam_id > 0) {
    $sql .= " AND r.exam_id = ?";
    $param_types .= "i";
    $params[] = $exam_id;
}

$sql .= " ORDER BY r.id DESC";

// Preparar y bind dinámico
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "error" => $conn->error, "query" => $sql], JSON_UNESCAPED_UNICODE);
    exit;
}

// bind params dinámicamente
$refs = [];
$types = $param_types;
foreach ($params as $i => $p) {
    $refs[$i] = &$params[$i];
}
array_unshift($refs, $types);
call_user_func_array([$stmt, 'bind_param'], $refs);

$stmt->execute();
$result = $stmt->get_result();
if (!$result) {
    echo json_encode(["success" => false, "error" => $conn->error], JSON_UNESCAPED_UNICODE);
    $stmt->close();
    $conn->close();
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        'alumno' => $row['alumno'] ?? null,
        'examen' => $row['examen'] ?? null,
        'calificacion' => isset($row['calificacion']) ? $row['calificacion'] : null,
        'fecha' => $row['fecha'] ?? null,
        // opcional: devolver ids originales para depurar
        'student_id' => $row['student_id'] ?? null,
        'exam_id' => $row['exam_id'] ?? null,
        'result_row' => $row
    ];
}

echo json_encode($data, JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();

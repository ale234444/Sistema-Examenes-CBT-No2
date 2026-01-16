<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// ✅ Conexión correcta a la base de datos
include_once(__DIR__ . "/../../db.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

    if ($teacher_id <= 0) {
        echo json_encode(["error" => "ID del docente no válido"]);
        exit;
    }

    // ✅ Consulta adaptada a tus tablas reales
    $query = "
        SELECT 
            g.id AS grade_id,
            g.nombre AS grade_name,
            sg.id AS group_id,
            sg.nombre AS group_name
        FROM teacher_assignments ta
        INNER JOIN grades g ON ta.grade_id = g.id
        INNER JOIN student_groups sg ON ta.group_id = sg.id
        WHERE ta.teacher_id = ?
        GROUP BY g.id, sg.id
    ";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(["error" => "Error al preparar la consulta: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    if (empty($data)) {
        echo json_encode(["mensaje" => "No se encontraron grados ni grupos para este docente"]);
    } else {
        echo json_encode($data);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Método no permitido"]);
}
?>

<?php
// backend/get_available_questions.php - VERSIÓN SUPER SIMPLE
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

require_once("../db.php");

$exam_id = intval($_GET['exam_id'] ?? 0);

// Consulta MUY simple sin preparación
$sql = "SELECT id, texto, tipo, correcta FROM questions LIMIT 10";
$result = $conn->query($sql);

if ($result) {
    $preguntas = [];
    while($row = $result->fetch_assoc()) {
        $preguntas[] = [
            'id' => $row['id'],
            'texto' => $row['texto'],
            'tipo' => $row['tipo'],
            'opciones' => ['Opción 1', 'Opción 2'], // Placeholder
            'respuesta_correcta' => $row['correcta']
        ];
    }
    
    echo json_encode([
        "success" => true,
        "preguntas" => $preguntas,
        "total" => count($preguntas),
        "message" => "Consulta simple exitosa"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error en consulta: " . $conn->error
    ]);
}

$conn->close();
?>
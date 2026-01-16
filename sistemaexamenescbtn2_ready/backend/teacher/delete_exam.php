<?php

include '../../db.php';

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Solo respondemos a la preflight y terminamos
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$id = $data->id ?? 0;

if(!$id){
    echo json_encode(["success"=>false,"message"=>"ID de examen requerido"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM exams WHERE id=?");
$stmt->bind_param("i",$id);

if($stmt->execute()){
    echo json_encode(["success"=>true,"message"=>"Examen eliminado"]);
}else{
    echo json_encode(["success"=>false,"message"=>"Error: ".$stmt->error]);
}
?>

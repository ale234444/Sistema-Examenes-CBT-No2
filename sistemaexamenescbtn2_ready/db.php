<?php
$servername = "localhost";
$username = "root";
$password = "12345678"; // ⚠️ Si tu MySQL tiene contraseña, escríbela aquí
$database = "sistemma_examenes"; // 👈 asegúrate de que el nombre sea exactamente este

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar con la base de datos",
        "error" => $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");
?>

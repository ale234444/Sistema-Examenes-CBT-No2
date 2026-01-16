<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "db.php"; // <-- AJUSTA si tu db.php está en otro lugar

// TU IP ACTUAL
$correctBase = "http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/";

// Buscar preguntas con imagen local incorrecta
$sql = "SELECT id, image_url FROM questions WHERE image_url LIKE '%localhost%'";
$result = $conn->query($sql);

if ($result->num_rows === 0) {
    echo "✔ No hay URLs que necesiten corrección";
    exit;
}

echo "<h2>Corrigiendo URLs...</h2>";

while ($row = $result->fetch_assoc()) {
    $id = $row["id"];
    $oldUrl = $row["image_url"];

    // Extraer solo el nombre del archivo
    $filename = basename($oldUrl);

    // Crear URL nueva correcta
    $newUrl = $correctBase . $filename;

    // Actualizar en BD
    $update = $conn->prepare("UPDATE questions SET image_url = ? WHERE id = ?");
    $update->bind_param("si", $newUrl, $id);

    if ($update->execute()) {
        echo "✔ Pregunta ID $id actualizada:<br>";
        echo "➡ $newUrl <br><br>";
    } else {
        echo "❌ Error con ID $id: " . $conn->error . "<br><br>";
    }
}

echo "<h2>LISTO. Todas las imágenes fueron corregidas.</h2>";

$conn->close();
?>

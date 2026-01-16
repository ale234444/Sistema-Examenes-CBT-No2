<?php
function verifyRole($expectedRole, $actualRole) {
    if ($expectedRole !== $actualRole) {
        echo json_encode(["success" => false, "message" => "No autorizado"]);
        exit;
    }
}
?>

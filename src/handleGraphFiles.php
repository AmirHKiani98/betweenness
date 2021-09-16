<?php
file_put_contents("json.json", json_encode($_POST, JSON_PRETTY_PRINT));
echo json_encode(["status" => 1, "message" => "recieved"]);
?>
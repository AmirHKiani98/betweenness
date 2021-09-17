<?php
$file = $_FILES["download-graph-input"];

// ToDo check the input and output

echo json_encode(["status" => 1, "message" => "recieved", "results" => $file["tmp_name"]]);
?>
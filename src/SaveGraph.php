<?php
$type = $_POST["type"];
$data = $_POST["data"];
$fileName = $_POST["file_name"];


if($type == "nodes"){
    $path = __DIR__ . "/../graphs/" . $fileName . ".co.txt";
    file_put_contents($path,$data);
    echo json_encode(["status" => "ok", "message" => "Graph's nodes have been saved"]);
}else{
    $path = __DIR__ . "/../graphs/" . $fileName . ".gr.txt";
    file_put_contents($path, $data);
    echo json_encode(["status" => "ok", "message" => "Graph's links have been saved"]);
}
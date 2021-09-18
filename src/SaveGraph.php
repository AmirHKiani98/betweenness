<?php
$type = $_POST["type"];
$data = $_POST["data"];
$fileName = $_POST["file_name"];
// $domain = "http://" + $_SERVER["HTTP_HOST"];

if($type == "nodes"){
    $path = __DIR__ . "/../graphs/" . $fileName . ".co.txt";
    file_put_contents($path,$data);
    $nodesLinks = "/graphs/" . $fileName . ".co.txt";
    echo json_encode(["status" => "ok", "message" => "Graph's nodes have been saved<br><a href='$nodesLinks' download>Nodes</a>"]);
}else{
    $path = __DIR__ . "/../graphs/" . $fileName . ".gr.txt";
    file_put_contents($path, $data);
    $linksLinks = "/graphs/" . $fileName . ".gr.txt";
    echo json_encode(["status" => "ok", "message" => "Graph's links have been saved<br><a href='$linksLinks' download>Links</a>"]);
}
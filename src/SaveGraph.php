<?php
$type = $_POST["type"];
$data = $_POST["data"];
$fileName = $_POST["file_name"];
$domain = "http://" . $_SERVER["HTTP_HOST"];

if($type == "nodes"){
    $path = __DIR__ . "/../graphs/" . $fileName . ".json";
    $jsonFile = ["elements"=>[]];
    foreach($data as $node){
        $jsonFile["elements"][] = ["type"=> "node","id" => $node["id"], "lon"=> $node["x"], "lat" => $node["y"]];
    }
    file_put_contents($path, json_encode($jsonFile, JSON_PRETTY_PRINT));
}else{
    $path = __DIR__ . "/../graphs/" . $fileName . ".json";
    $jsonFile = json_decode(file_get_contents($path), 1);
    foreach ($data as $key => $link) {
        $jsonFile["elements"][]= ["type"=>"way", "nodes"=> [$link["from"], $link["to"]]];
    }
    file_put_contents($path, json_encode($jsonFile, JSON_PRETTY_PRINT));
    // file_put_contents($path, $data);
    // $linksLinks = "/graphs/" . $fileName . ".gr.txt";
    // echo json_encode(["status" => "ok", "message" => "Graph's links have been saved<br><a href='$linksLinks' download>Links</a>"]);
    // $execute = "node graphs_scripts/SaveGraph.js graphs/$fileName.json";
    // shell_exec("node http://localhost:3000/graphs_scripts/SaveGraph.js graphs/New.json");
    
    // // Zipping the files
    // $zip = new ZipArchive();
    // if (file_exists(__DIR__ . "/../garphs/zips/$fileName.zip")) {
    //     unlink(__DIR__ . "/../garphs/zips/$fileName.zip");
    // }
    // if($zip->open(__DIR__ . "/../garphs/zips/$fileName.zip", ZIPARCHIVE::CREATE) != TRUE){
    //     // echo json_encode(["status" => "ok", "message" => "Couldn't create zip file"]);
    // }else{
    //     $zip->addFile(__DIR__ . "/../garphs/$fileName.co.txt");
    //     $zip->addFile(__DIR__ . "/../garphs/$fileName.gr.txt");
    //     // echo json_encode(["status" => "ok", "message" => "Graph's links have been saved<br><a href='/graphs/zips/$fileName.zip' download>Links</a>"]);
    // }
    echo json_encode(["status" => "ok", "message" => "Graph's links have been saved<br><a href='/graphs/$fileName.json' download>Links</a>"]);

}


<?php
$type = $_POST["type"];
$data = $_POST["data"];
$fileName = $_POST["file_name"];
if($type == "node"){
    $path = __DIR__ . "/../graphs/" + $fileName + ".co.bin";
    echo($data);
    // file_put_contents()
}else{

}
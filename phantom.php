<?php
$mode = "";
$mode = htmlentities($_GET['mode'], ENT_QUOTES, "UTF-8");
$resp = array();
$resp_code = "";
if(!in_array($mode,array("web","mobile"))){
    $resp_code = "HTTP/1.1 400 Bad Request";
}else{
    require_once 'YioopPhantomRunner.php';
    $yioop_phantom_runner = new YioopPhantomRunner();
    $test_results = ($yioop_phantom_runner->execute(
        "/Users/epinapala/yioop_tests/".$mode."_ui_tests.js", false));
    if(!$test_results) {
        $resp_code = "HTTP/1.1 500";
    } else {
        $resp['results'] = $test_results;
        $resp_code = "HTTP/1.1 200 OK";
    }
}

echo (json_encode($resp));
header($resp_code);
exit();
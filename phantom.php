<?php
require_once 'YioopPhantomRunner.php';
$yioop_phantom_runner = new YioopPhantomRunner();
$test_results = ($yioop_phantom_runner->execute(
    "/Users/epinapala/yioop_tests/yiooptest.js", false));
$resp = array();
$resp_code = "";
if(!$test_results) {
    $resp_code = "HTTP/1.1 500";
} else {
    $resp['results'] = $test_results;
    $resp_code = "HTTP/1.1 200 OK";
}
echo (json_encode($resp));
header($resp_code);
exit();
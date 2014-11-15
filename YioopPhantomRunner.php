<?php
class YioopPhantomRunner
{
    private $phantomjs_bin_path = 'phantomjs';
    public function __construct($bin_path = null)
    {
        if($bin_path !== null) {
            $this->phantomjs_bin_path = $bin_path;
        }
    }
    public function execute($script,$decode_json = false)
    {
        $shell_result = shell_exec(
            escapeshellcmd("{$this->phantomjs_bin_path} " . implode(' ',
                    func_get_args())));
        if($shell_result === null) {
            return false;
        }
        if($decode_json){
            if(substr($shell_result, 0, 1) !== '{') {
                //return if the result is not a JSON.
                return $shell_result;
            } else {
                //If the result is a JSON, decode JSON into a PHP array.
                $json = json_decode($shell_result,true);
                if($json === null) {
                    return false;
                }
                return $json;
            }
        }else{
            return $shell_result;
        }

    }
}
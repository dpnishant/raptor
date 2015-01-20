<?php

session_start();

if(empty($_SESSION['user_name'])) {
 header('Location: login.php'); 
}

$_SESSION['current_scan_report'] = '';

define('PATH', '/var/raptor/scan_results');

function isValidJSON($string) {

 json_decode($string);
 return (json_last_error() == JSON_ERROR_NONE);

}

function write_to_file($data, $username, $scan_name) {

	$timestamp = time();
	$path = PATH . '/' . $username . '/' . $scan_name . '/' . $_SESSION['git_repo'] . '/';

	if (mkdir($path, $mode = 0777, $recursive = true)) {
		$filename = $path . $timestamp . '.json';
		$fp = fopen($filename, 'w');
		fwrite($fp, $data);
		fclose($fp);
		$_SESSION['current_scan_report'] = $filename;
		return true;
	} else {
		return false;
	}
}

if(!empty($_SESSION['git_repo']) && !empty($_SESSION['scan_active'])) {
	
	$path = PATH . '/' . $_SESSION['user_name'] . '/' . $_SESSION['scan_name'] . '/' . $_SESSION['git_repo'] . '/' . 	time() . '.json';
	error_log($path);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/external/scan/?r=' . $_SESSION['git_repo'] . '&p=' . $path);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$json = curl_exec($ch);
	curl_close($ch);

	if ($json) {
		header('Content-Type: text/html');
		echo "OK";	
	} else {
		header('Content-Type: text/html');
		echo "Failed";
	}
	
	$_SESSION['current_scan_report'] = $path;
}

?>
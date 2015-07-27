<?php

include_once("session.php");


$_SESSION['current_scan_report'] = '';

define('PATH', '/var/raptor/scan_results');
define('ENDPOINT', 'http://127.0.0.1:8000'); #defined in gunicorn_config.py

function isValidJSON($string) {

 json_decode($string);
 return (json_last_error() == JSON_ERROR_NONE);

}

function write_to_file($data, $username, $scan_name) {

	$timestamp = time();
	if ( !empty($_SESSION['git_repo']) ) {
		$path = PATH . '/' . $username . '/' . $scan_name . '/' . $_SESSION['git_repo'] . '/';	
	} elseif ( !empty($_SESSION['zip_name']) && !empty($_SESSION['upload_id']) ) {
		$path = PATH . '/' . $username . '/' . $scan_name . '/' . $_SESSION['upload_id'] . '/';	
	}
	

	if ( mkdir($path, $mode = 777, $recursive = true) ) {
		$filename = $path . $timestamp . '.json';
		$fp = fopen($filename, 'w');
		fwrite($fp, $data);
		if (!chmod($filename, 777)) {
			error_log('777 failed: ' . $filename, 0);
		}
		fclose($fp);
		$_SESSION['current_scan_report'] = $filename;
		return true;
	} else {
		return false;
	}
}

if( !empty($_SESSION['git_repo']) && !empty($_SESSION['scan_active']) ) {
	
	$path = PATH . '/' . $_SESSION['user_name'] . '/' . $_SESSION['scan_name'] . '/' . $_SESSION['git_repo'] . '/' . 	time() . '.json';
	//error_log('DEBUG: <proxy.php>'.$_SESSION['git_repo']);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, ENDPOINT . '/' . $_SESSION['git_type'] . '/scan/?r=' . $_SESSION['git_repo'] . '&p=' . $path);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$json = curl_exec($ch);
	curl_close($ch);

	if ($json) {
		header('Content-Type: text/html');
		echo "Success";	
	} else {
		header('Content-Type: text/html');
		echo "Failed";
	}
	
	$_SESSION['current_scan_report'] = $path;
}


if(!empty($_SESSION['zip_name']) && !empty($_SESSION['scan_active'])) {
	
	$path = PATH . '/' . $_SESSION['user_name'] . '/' . $_SESSION['scan_name'] . '/' . $_SESSION['upload_id'] . '/' . 	time() . '.json';
	error_log($path);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, ENDPOINT . '/zip/scan/?upload_id=' . $_SESSION['upload_id'] . '&p=' . $path . '&zip_name=' . $_SESSION['zip_name']);
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

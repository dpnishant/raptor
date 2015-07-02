<?php

include_once("session.php");

define('ENDPOINT', 'http://127.0.0.1:8000'); #defined in gunicorn_config.py

@$report_id = $_GET['id'];

if(!empty($report_id)) {
	$delete_dir = $_SESSION['delete_id'][$report_id];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, ENDPOINT . '/purge/?path=' . $delete_dir);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
	header('Location: history.php');
}

?>

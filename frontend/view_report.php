<?php

include("session.php");

@$report_id = $_GET['id'];

if(!empty($report_id)) {
	error_log(print_r('Viewing: ' . $_SESSION['report_id'][$report_id]));
	$_SESSION['current_scan_report'] = $_SESSION['report_id'][$report_id];
	header('Location: issues.php');
}

?>
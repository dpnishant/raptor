<?php

include_once("session.php");


function rrmdir($dir) { 
  foreach(glob($dir . '/*') as $file) { 
    if(is_dir($file)) rrmdir($file); else unlink($file); 
  } rmdir($dir); 
}

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }

    if (!is_dir($dir)) {
        return unlink($dir);
    }

    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }

    }

    return rmdir($dir);
}

@$report_id = $_GET['id'];

if(!empty($report_id)) {
	$delete_dir = $_SESSION['delete_id'][$report_id];
//print_r($delete_dir);	
//print_r(deleteDirectory($delete_dir));
	header('Location: history.php');
}

?>

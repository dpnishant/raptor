<?php
session_start();

if(empty($_SESSION['user_name'])) {
 header('Location: login.php'); 
}

$time = $_SERVER['REQUEST_TIME'];
/**
 * for a 60 minute timeout, specified in seconds
 */
$timeout_duration = 60*60;

/**
 * Here we look for the user’s LAST_ACTIVITY timestamp. If
 * it’s set and indicates our $timeout_duration has passed, 
 * blow away any previous $_SESSION data and start a new one.
 */
if (isset($_SESSION['LAST_ACTIVITY']) && ($time - $_SESSION['LAST_ACTIVITY']) > $timeout_duration) {
  session_unset();     
  session_destroy();
  session_start();
  header('Location: login.php'); 
}
    
/**
 * Finally, update LAST_ACTIVITY so that our timeout 
 * is based on it and not the user’s login time.
 */
$_SESSION['LAST_ACTIVITY'] = $time;

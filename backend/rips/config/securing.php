<?php
/** 

RIPS - A static source code analyser for vulnerabilities in PHP scripts 
	by Johannes Dahse (johannes.dahse@rub.de)
			
			
Copyright (C) 2012 Johannes Dahse

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.	

**/
		
	// securing functions in if-clause 
	// list not used, all if clause dependencies detected anyway
	$F_SECURING_BOOL = array(
		'is_double',
		'is_float',
		'is_real',
		'is_long',
		'is_int',
		'is_integer',
		'ctype_alnum',
		'ctype_alpha',
		'ctype_cntrl',
		'ctype_digit',
		'ctype_xdigit',
		'ctype_upper',
		'ctype_lower',
		'ctype_space',
		'in_array',
		'preg_match',
		'preg_match_all',
		'fnmatch',
		'ereg',
		'eregi'
	);
	
	// securing functions for every vulnerability
	$F_SECURING_STRING = array(
		'intval',
		'floatval',
		'doubleval',
		'filter_input',
		'urlencode',
		'rawurlencode',
		'round',
		'floor',
		'strlen',
		'hexdec',
		'strrpos',
		'strpos',
		'md5',
		'sha1',
		'crypt',
		'crc32',
		'hash',
		'base64_encode',
		'ord',
		'sizeof',
		'count',
		'bin2hex',
		'levenshtein',
		'abs',
		'bindec',
		'decbin',
		'hexdec',
		'rand',
		'max',
		'min'
	);
	
	// functions that insecures the string again 
	$F_INSECURING_STRING = array(
		'rawurldecode',
		'urldecode',
		'base64_decode',
		'html_entity_decode',
		'str_rot13',
		'chr'
	);

	// securing functions for XSS
	$F_SECURING_XSS = array(
		'htmlentities',
		'htmlspecialchars'
	);	
	
	// securing functions for SQLi
	$F_SECURING_SQL = array(
		'addslashes',
		'dbx_escape_string',
		'db2_escape_string',
		'ingres_escape_string',
		'maxdb_escape_string',
		'maxdb_real_escape_string',
		'mysql_escape_string',
		'mysql_real_escape_string',
		'mysqli_escape_string',
		'mysqli_real_escape_string',
		'pg_escape_string',	
		'pg_escape_bytea',
		'sqlite_escape_string',
		'sqlite_udf_encode_binary'
	);	
	
	// securing functions for RCE with e-modifier in preg_**
	$F_SECURING_PREG = array(
		'preg_quote'
	);
	
	// securing functions for file handling
	$F_SECURING_FILE = array(
		'basename',
		'pathinfo'
	);
	
	// securing functions for OS command execution
	$F_SECURING_SYSTEM = array(
		'escapeshellarg',
		'escapeshellcmd'
	);	
	
	// securing XPath injection
	$F_SECURING_XPATH = array(
		'addslashes'
	);
	
	// securing LDAP injection
	$F_SECURING_LDAP = array(
	);
	
	// all specific securings
	$F_SECURES_ALL = array_merge(
		$F_SECURING_XSS, 
		$F_SECURING_SQL,
		$F_SECURING_PREG,
		$F_SECURING_FILE,
		$F_SECURING_SYSTEM,
		$F_SECURING_XPATH
	);	
	
	// securing functions that work only when embedded in quotes
	$F_QUOTE_ANALYSIS = $F_SECURING_SQL;
		
?>	
import os, sys
from lxml import etree

plugin_name = "android_manifest"

def scanAndroidManifest(path):
	all_issues = []
	xml_issue = {}
	root = etree.parse(path).getroot()

	def prep_attrib(attrib_name):
		return '{http://schemas.android.com/apk/res/android}' + str(attrib_name)

	def xml2str(element):
		return etree.tostring(element).replace('xmlns:android="http://schemas.android.com/apk/res/android" ', '').rstrip()

	# ISSUE: Improper Content Provider Permissions
	# SEVERITY: High
	# DESCRIPTION: A content provider permission 
	# was set to allows access from any other app 
	# on the device. Content providers may contain
	# sensitive information about an app and therefore
	# should not be shared.

	grant_uri_permissions = root.findall('.//grant-uri-permission')

	for node in grant_uri_permissions:
		flag = 0
		xml_issue = {}
		uri_prefix = node.get(prep_attrib('pathPrefix'))
		uri_path = node.get(prep_attrib('path'))
		uri_pattern = node.get(prep_attrib('pathPattern'))
		if(uri_prefix and uri_prefix == '/'):
			flag = 1
		elif(uri_path and uri_path == '/'):
			flag = 1
		elif(uri_pattern and uri_pattern == '*'):
			flag = 1
		if flag:
			xml_issue["warning_type"] =  "Improper Content Provider Permissions"
			xml_issue["warning_code"] = "CODE-00"
			xml_issue["message"] = "A content provider permission was set to allows access from any other app on the device. Content providers may contain sensitive information about an app and therefore should not be shared."
			xml_issue["file"] = path.replace(os.getcwd(),'')
			xml_issue["line"] = node.sourceline
			xml_issue["link"] = "http://example.org"
			xml_issue["code"] = xml2str(node)
			xml_issue["severity"] = "High"
			xml_issue["plugin"] = plugin_name
		all_issues.append(xml_issue)

		# Issue: Service Not Properly Protected
		# Severity: S2
		# Logic: search for services without permissions set - if a service is exported without permissions or an intent filter, flag it
		# Description: A service was found to be shared with other apps on the
		# device without an intent filter or a permission requirement
		# therefore leaving it accessible to any other application on
		# the device.
	
		services = root.findall('.//application/service')
		for service in services:
			flag = 0
			xml_issue = {}
			if len(service) <= 0:
				if not service.get(prep_attrib('permission')) == 'self':
					flag = 1
			else:
				for child in service:
					if child.tag == 'intent-filter':
						flag = 0
					else:
						flag = 1
			if flag == 1:
				xml_issue["warning_type"] =  "Exported service possibly not protected"
				xml_issue["warning_code"] = "CODE-00"
				xml_issue["message"] = "The service '" + service.get(prep_attrib('name')) + "' was found to be shared with other apps on the device without an intent filter or a permission requirement therefore leaving it accessible to any other application on the device."
				xml_issue["file"] = path.replace(os.getcwd(),'')
				xml_issue["line"] = service.sourceline
				xml_issue["link"] = "http://example.org"
				xml_issue["code"] = xml2str(service)
				xml_issue["severity"] = "Medium"
				xml_issue["plugin"] = plugin_name
			all_issues.append(xml_issue)
	return all_issues
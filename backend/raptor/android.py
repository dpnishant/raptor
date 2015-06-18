#!usr/bin/python
#
# The security checks in this module have been taken from 
# https://github.com/antitree/manitree/ project.
# All credit goes to the author.
#

import os, sys, re, linecache, json
from lxml import etree

plugin_name = "android_manifest"

def prep_attrib(attrib_name):
    return '{http://schemas.android.com/apk/res/android}' + str(attrib_name)

def xml2str(element):
    return etree.tostring(element).replace('xmlns:android="http://schemas.android.com/apk/res/android" ', '').rstrip()

def reportIssue(warning_type, warning_code, message, severity, path, node):
    xml_issue = {}
    xml_issue["warning_type"] = warning_type
    xml_issue["warning_code"] = warning_code
    xml_issue["message"] = message
    xml_issue["file"] = re.sub('/(clones|uploads)/[a-zA-Z0-9]{56}/', '', path.replace(os.getcwd(),''))
    xml_issue["line"] = node.sourceline
    xml_issue["link"] = "http://developer.android.com/guide/topics/security/permissions.html"
    xml_issue["code"] = xml2str(node)
    xml_issue["short_code"] = linecache.getline(path, node.sourceline)
    xml_issue["severity"] = severity
    xml_issue["plugin"] = plugin_name
    all_issues.append(xml_issue)

def scanAndroidManifest(path):
    global all_issues
    all_issues = []
    root = etree.parse(path).getroot()

# ISSUE: Improper Content Provider Permissions
# SEVERITY: High
# DESCRIPTION: A content provider permission
# was set to allows access from any other app
#             on the device. Content providers may contain
#             sensitive information about an app and therefore
#             should not be shared.

    grant_uri_permissions = root.findall('.//grant-uri-permission')
    for uri_node in grant_uri_permissions:
        flag = 0
        uri_prefix = uri_node.get(prep_attrib('pathPrefix'))
        uri_path = uri_node.get(prep_attrib('path'))
        uri_pattern = uri_node.get(prep_attrib('pathPattern'))
        if (uri_prefix and uri_prefix == '/'):
            flag = 1
        elif (uri_path and uri_path == '/'):
            flag = 1
        elif (uri_pattern and uri_pattern == '*'):
            flag = 1
        if flag:
            reportIssue("Improper Content Provider Permissions", "CODE-01", "A content provider permission was set to allows access from any other app on the device. Content providers may contain sensitive information about an app and therefore should not be shared.", "High", path, uri_node)

# Issue: Service Not Properly Protected
# Severity: High
# Logic: search for services without permissions set - if a service is exported without permissions or an intent filter, flag it
# Description: A service was found to be shared with other apps on the
#             device without an intent filter or a permission requirement
#             therefore leaving it accessible to any other application on
#             the device.

    services = root.findall('.//application/service')
    for service_node in services:
        intent_filter_exists = False
        service_permissions = False
        if service_node.get(prep_attrib('exported')) == 'true':
            for service_child in service_node:
                if service_child.tag == 'intent-filter':
                    intent_filter_exists = True
                if service_node.get(prep_attrib('permission')):
                    service_permissions = True
        if (intent_filter_exists or service_permissions):
            reportIssue("Exported service possibly not protected", "CODE-02", "The service '" + service_node.get(prep_attrib('name')) + "' was found to be shared with other apps on the device without an intent filter or a permission requirement therefore leaving it accessible to any other application on the device.", "High", path, service_node)

# Issue: Application Debug Enabled
# Severity: High
# Logic: search for nodes with tag name as application and check if the node has a 'android:debuggable' attribute value set to 'true'
# Description: Debugging was enabled on the app which makes it easier for reverse engineers to hook a debugger to it.
#             This allows dumping a stack trace and accessing debugging helper classes.

    applications = root.findall('.//application')
    for app_node in applications:
        if app_node.get(prep_attrib('debuggable')) == 'true':
            reportIssue("Debug Enabled For App", "CODE-03","Debugging was enabled on the app which makes it easier for reverse engineers to hook a debugger to it. This allows dumping a stack trace and accessing debugging helper classes.", "High", path, app_node)

# Issue: Intent Filter Set with High Priority value
# Severity: Low
# Logic: search for all intent-filter nodes with android:priorty attribute value set to more than 100.
# Description: By setting an intent priority higher than another intent, the app effectively overrides other requests.
#             This is commonly associated with malware.
    intent_filters = root.findall('.//intent-filter')
    for intent_node in intent_filters:
        priority = intent_node.get(prep_attrib('priority'))
        if priority and priority.isdigit() and int(priority) >= 100:
            reportIssue('Intent Filter Set with High Priority value', 'CODE-04','By setting an intent priority higher than another intent, the app effectively overrides other requests. This is commonly associated with malware.', "Low", path, intent_node)

# Issue: Insecure permissions
# Severity: Low/Medium
# Logic: search for all intent-filter nodes with android:priorty attribute value set to more than 100.
# Description: By setting an intent priority higher than another intent, the app effectively overrides other requests.
#             This is commonly associated with malware.

    permissions = root.findall('.//permission')
    for perm_node in permissions:
        pl = perm_node.get(prep_attrib('protectionLevel'))
        pn = perm_node.get(prep_attrib('name'))
        if pl == "signatureOrSystem":
            reportIssue('Custom Permision Uses "signatureOrSystem" Protection Level', 'CODE-05','A custom permission named ' + pn + ' controls whether or not other applications can access the affected apps features. The use of "signatureOrSystem" requires that the requesting app be signed with the same signature as the one used for the system image. This value should be used only in special cases.', 'Low', path, perm_node)
        elif pl == "signature":
            reportIssue('Custom Permission Uses "signature" Protection Level', 'CODE-05','A custom permission named ' + pn + ' controls whether or not other applications can access the affected app features. The use of "signature" requires the requesting app to be signed the with same signature as the application that declared the permission.', 'Low', path, perm_node)
        elif pl == "dangerous":
            reportIssue('Custom Permission Uses "dangerous" Protection Level', 'CODE-05','A custom permission named ' + pn + ' controls whether or not other applications can access the affected apps features. The use of the "dangerous" label places no restrictions on which apps can access the application declaring the permission but the user will be warned that the dangerous permission is required during installation.', 'Medium', path, perm_node)
        elif pl == "normal":
            reportIssue('Custom Permission Uses "normal" Protection Level', 'CODE-05','A custom permission named ' + pn + ' controls whether or not other applications can access the affected apps features. The use of the "normal" label places no restrictions on which apps can access the application declaring the permission. It is important that permission does not grant sensitive access to the application.', 'Medium', path, perm_node)

# Issue: List all permissions
# Severity: Low
# Logic: search all 'uses-permission' tags and read the value of the 'android:name' attribute.
# Description: By setting an intent priority higher than another intent, the app effectively overrides other requests.
#             This is commonly associated with malware.

    uses_permissions = root.findall('.//uses-permission')
    for node in uses_permissions:
        perm_name = node.get(prep_attrib('name')).replace('android.permission.', '')
        reportIssue('Permission Requested', 'CODE-06', 'The application has requested for ' + perm_name + ' permission.', 'Low', path, node)

    return all_issues

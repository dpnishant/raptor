#!/usr/bin/python
'''

INFO
----
This module is uses the rules defined patterns.json of the Gitrob project:
https://github.com/michenriksen/gitrob created by Michael Henriksen.
'''
import os, sys, re, json, base64
import log

def load_gitrob_rules(fname):
    file = open(fname, 'r')
    return json.loads(file.read())

def gitrob_scan(root_path, rules_path):
    global gitrob_issues, gitrob_rules
    gitrob_issues = []
    gitrob_rules = load_gitrob_rules(rules_path) #load all the gitrob rules
    for directory, sub_dirs, files in os.walk(root_path):
        flag = False
        for _file in files:
            flag = False
            gitrob_issue = {}
            _filename, _filext = os.path.splitext(_file)
            file_path = os.path.join(directory, _file)
            for gitrob_rule in gitrob_rules:
                pattern = re.compile(base64.b64decode(gitrob_rule['pattern']))
                if gitrob_rule['part'] == 'filename' and pattern.search(_file):
                    flag = True
                elif gitrob_rule['part'] == 'extension' and pattern.search(_filext):
                    flag = True
                elif gitrob_rule['part'] == 'path' and pattern.search(file_path):
                    flag = True
                if flag:
                    gitrob_issue['warning_type'] =  'Sensitive Information Disclosure'
                    gitrob_issue['warning_code'] = 'SID'
                    gitrob_issue['message'] = str(gitrob_rule['caption'])
                    gitrob_issue['file'] = re.sub('/var/raptor/(clones|uploads)/[a-zA-Z0-9]{56}/', '', file_path.replace(os.getcwd(), '').replace(root_path, '')).lstrip('/')
                    gitrob_issue['line'] = ''
                    gitrob_issue['link'] = 'https://www.owasp.org/index.php/Top_10_2013-A6-Sensitive_Data_Exposure'
                    gitrob_issue['code'] = 'n/a'
                    gitrob_issue['severity'] = 'High'
                    gitrob_issue['plugin'] = 'gitrob'
                    gitrob_issue['signature'] = str(gitrob_rule['pattern'])
                    gitrob_issue['location'] = 'n/a'
                    gitrob_issue['user_input'] = 'n/a'
                    gitrob_issue['render_path'] = 'n/a'
                    gitrob_issues.append(gitrob_issue)
                    flag = False
    return gitrob_issues

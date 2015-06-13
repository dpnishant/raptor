#!/usr/bin/python
import os, sys, re, fnmatch, json, base64, time
from datetime import datetime
from raptor_android import *

def version():
	return 'beta'

class Scanner(object):

	def __init__(self, app, rule, report):
		self.startTime = time.strftime("%a, %d %b %Y %I:%M:%S %p", time.localtime())
		self.startTimer = time.clock()

		self.file_exts = []
		self.issues = []
		self.rules = []
		self.plugin_name = ""
		global report_blob

		report_blob = { 
  			"scan_info": {
				"app_path": "",
				"security_warnings": "",
				"start_time": "",
				"end_time": "",
				"duration": "",
				"version": "0.0.1"
  			},
  			"warnings": [],
  			"ignored_warnings": [],
  			"errors": []
		}

		app = os.path.abspath(app)
		rule = os.path.abspath(rule)
		report = os.path.abspath(report)

		if os.path.isfile(os.path.abspath(app)):
			self.save_report(self.scan(rule, app, "file"), report)
		elif os.path.isdir(os.path.abspath(app)):
			self.save_report(self.scan(rule, app, "dir"), report)
		else:
			print "Error: Invalid path (%s)" % app

	def generate_json(self, path, total, warnings):
		self.endTime = time.strftime("%a, %d %b %Y %I:%M:%S %p", time.localtime())
		self.stopTimer = time.clock()
		report_blob["scan_info"]["app_path"] = path
		report_blob["scan_info"]["security_warnings"] = total
		report_blob["scan_info"]["start_time"] = str(self.startTime)
		report_blob["scan_info"]["end_time"] = str(self.endTime)
		report_blob["scan_info"]["duration"] = str(self.stopTimer - self.startTimer)
		report_blob["scan_info"]["version"] = "0.0.1"
		report_blob["warnings"] = warnings
		report_blob["ignored_warnings"] = ""
		report_blob["errors"] = ""
		return report_blob

	def save_report(self, blob, path):
		blob = json.dumps(blob, sort_keys=True, indent=2)
		if os.path.isdir(path):
			report_file = "report.json"
			path = path + report_file
			fhandle = open(path, "w")
			content = fhandle.write(blob)
			fhandle.close()
		else:
			fhandle = open(path, "w")
			content = fhandle.write(blob)
			fhandle.close()

	def load_rules(self, fname):
		if os.path.isfile(os.path.abspath(fname)):
			file_path = os.path.abspath(fname)
			file = open(file_path, "r")
			self.rules = json.loads(file.read())
			self.file_exts = self.rules['file_types']
		else:
			print "Error: rulepack %s not accessible" % fname

	def walk_dir(self, dirname, file_ext):
		for root, dirnames, filenames in os.walk(dirname):
			for filename in fnmatch.filter(filenames, file_ext):
				file_path = os.path.join(root, filename)
				self.read_file(file_path)

	def read_file(self, fpath):
		file_ext = os.path.splitext(fpath)[1].strip().lower()

		if(self.plugin_name == 'android' and fpath.rfind('/AndroidManifest.xml') > -1):
			manifest_issues = scanAndroidManifest(fpath)
			if manifest_issues:
				for manifest_issue in manifest_issues:
					self.issues.append(manifest_issue)

		if (file_ext in self.file_exts):
			fhandle = open(fpath, 'r')
			lines = fhandle.readlines()
			for line in range(0, len(lines)):
				delim_line = '%s:%d:%s' % (fpath, line, lines[line])
				self.scan_line(delim_line, fpath)
			fhandle.close()

	def scan_line(self, line, fpath):
		issue = {}
		line_obj = line
		line_obj = line_obj.split(':')
		file_path = line_obj[0]
		line_num = line_obj[1]
		line_content = line_obj[2]
	
		for rule in self.rules["rules"]:
			if rule["enabled"] == "true":
				rule_signature = base64.b64decode(rule["signature"])
				pattern = re.compile(rule_signature)
				if pattern.search(line_content):
					issue["warning_type"] =  str(rule["title"])
					issue["warning_code"] = str(rule["id"])
					issue["message"] = str(rule["description"])
					issue["file"] = re.sub('/(clones|uploads)/[a-zA-Z0-9]{56}/', '', fpath.replace(os.getcwd(),''))
					issue["line"] = int(line_num) + 1
					issue["link"] = str(rule["link"])
					issue["code"] = line_content.strip("\n").strip("\r").strip("\t").strip(" ")
					issue["severity"] = str(rule["severity"])
					issue["plugin"] = self.plugin_name
					issue["signature"] = str(rule["signature"])
					issue["location"] = ''
					issue["user_input"] = ''
					issue["render_path"] = ''
					self.issues.append(issue)

	def scan(self, rule_path, app_path, type):
		self.issues = []
		self.plugin_name = rule_path[rule_path.rfind('/')+1:len(rule_path)].replace('.rulepack','')
		self.load_rules(rule_path)
		if type == "file":
			self.read_file(app_path)
		elif type == "dir":
			self.walk_dir(app_path, "*")
		return self.generate_json(app_path, len(self.issues), self.issues)

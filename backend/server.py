import sys, os
from raptor_init import *
import json
from flask import Flask, request, jsonify, Response
from werkzeug.contrib.fixers import ProxyFix

app = Flask(__name__)
app.debug=True

@app.errorhandler(500)
def server_error(e):
    return 'Internal Server Error', 500	

@app.route('/', methods=['GET'])
def help():
	return '<h1>Usage</h1><h3>/scan/?r=&lt;git-repo-path&gt;</h3>'

@app.route('/internal/scan/', methods=['GET'])
def internal_repo_scan():
	repo = request.args.get('r')
	report_directory = request.args.get('p')
	json_results = start(repo, report_directory, internal=True)
	
	if not os.path.exists(os.path.dirname(report_directory)):
		os.makedirs(os.path.dirname(report_directory), mode=0777)
	
	results = str(json.dumps(json_results))
	
	fhandle = open(report_directory, "w")
	content = fhandle.write(results)
	fhandle.close()

	print "[INFO] Report created at %s" % (report_directory)

	return jsonify(json_results)

@app.route('/external/scan/', methods=['GET'])
def external_repo_scan():
	repo = request.args.get('r')
	report_directory = request.args.get('p')
	json_results = start(repo, report_directory, internal=False)


	if not os.path.exists(os.path.dirname(report_directory)):
		os.makedirs(os.path.dirname(report_directory), mode=0777)
	
	results = str(json.dumps(json_results))
	
	fhandle = open(report_directory, "w")
	content = fhandle.write(results)
	fhandle.close()
	

	return jsonify(json_results)

app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == "__main__":
	app.run(host='0.0.0.0',port=5000)

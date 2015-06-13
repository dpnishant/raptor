from raptor_init import *
from flask import Flask, request, jsonify, Response, redirect, url_for
from werkzeug.contrib.fixers import ProxyFix
from werkzeug import secure_filename
import sys, os, json, threading, hashlib, shutil, zipfile


app = Flask(__name__)
app.debug=True

@app.errorhandler(500)
def server_error(e):
    return 'Internal Server Error', 500    

@app.route('/', methods=['GET'])
def help():
    return '<h1>Usage</h1><h3>/scan/?r=&lt;git-repo-path&gt;&amp;p=&lt;report-save-directory&gt;</h3>'

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
    print "[INFO] Report created at %s" % (report_directory)
    return jsonify(json_results)


UPLOAD_FOLDER = os.path.abspath('./uploads')
ALLOWED_EXTENSIONS = set(['zip'])

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def unzip_thread(fname, path='.'):
    def unzip(fname, path='.'):
        try:
            if zipfile.is_zipfile(fname):
                z = zipfile.ZipFile(fname, 'r')
                z.extractall(path)
                os.remove(fname)
                return True
            else:
                return False
        except Exception as e:
            print e
            return False
    t = threading.Thread(target=unzip, args=(fname, path))
    t.start()

#exposed via nginx route
@app.route("/raptor/upload", methods=['POST'])
def index():
    user = request.form.get('usr')
    if user and request.method == 'POST':
        upld_file = request.files['file']
        scan_name = request.form.get('scan_name')

        if upld_file and allowed_file(upld_file.filename):
            try:
                filename = secure_filename(upld_file.filename)
                save_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                upld_file.save(save_path)
                new_fname = hashlib.sha224(open(save_path, 'rb').read()).hexdigest()+'.zip'
                new_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], new_fname))
                os.rename(save_path, new_path)
                unzip_thread(new_path, os.path.join(UPLOAD_FOLDER, new_fname.rstrip('.zip')))
                return redirect('/raptor/scan.php?scan_name=%s&upload_id=%s&zip_name=%s' % (scan_name, new_fname.rstrip('.zip'), upld_file.filename), code=302)
            except Exception as e:
                print e

#server-side call; nginx route not required
@app.route('/zip/scan/', methods=['GET'])
def zip_scan():
    upload_id = request.args.get('upload_id')
    zip_name = request.args.get('zip_name')
    report_directory = request.args.get('p')
    json_results = scan_zip(upload_id, zip_name, report_directory)

    if not os.path.exists(os.path.dirname(report_directory)):
        os.makedirs(os.path.dirname(report_directory), mode=0777)
    
    results = str(json.dumps(json_results))
    
    fhandle = open(report_directory, "w")
    content = fhandle.write(results)
    fhandle.close()
    print "[INFO] Report created at %s" % (report_directory)
    return jsonify(json_results)


app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000)

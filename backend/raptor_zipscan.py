import os, zipfile, threading, hashlib, shutil
from flask import Flask, request, redirect, url_for
from werkzeug import secure_filename

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = set(['zip'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
                new_fname = hashlib.md5(open(save_path, 'rb').read()).hexdigest()+'.zip'
                new_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], new_fname))
                os.rename(save_path, new_path)
                unzip_thread(new_path, new_fname.rstrip('.zip'))
                return redirect('http://127.0.0.1/raptor/scan.php?scan_name=%s&upload_id=%s&zip_name=%s' % (scan_name, new_fname.rstrip('.zip'), upld_file.filename), code=302)
            except Exception as e:
                print e
    #return """
    #<!doctype html>
    #<title>Upload new File</title>
    #<h1>Upload new File</h1>
    #<form action="http://127.0.0.1:5001/raptor/upload" method=post enctype=multipart/form-data>
    #  <p><input type=file name=file>
    #     <input type=submit value=Upload>
    #</form>
    #<p>%s</p>
    #""" % "<br>".join(os.listdir(app.config['UPLOAD_FOLDER'],))

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
            return False
    t = threading.Thread(target=unzip, args=(fname, path))
    t.start()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
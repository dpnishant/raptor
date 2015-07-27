#!usr/bin/python
import os, sys, subprocess, shutil, json, linecache, base64, fnmatch, traceback
import BeautifulSoup as bs
import log

bin_paths = {}
bin_paths['nodejs'] = '/usr/bin/nodejs' if os.path.isfile('/usr/bin/nodejs') else '/usr/local/bin/node'
bin_paths['brakeman'] = '/usr/local/bin/brakeman' if os.path.isfile('/usr/local/bin/brakeman') else '/usr/bin/brakeman'
bin_paths['scanjs'] = os.getcwd() + '/scanjs/scanner.js'
bin_paths['php'] = '/usr/bin/php'
bin_paths['rips'] = os.getcwd() + '/rips/main.php'

def scanjs(path):
    report_name = path + '/scanjs_result'
    p = subprocess.Popen([bin_paths['nodejs'], bin_paths['scanjs'], '-t', path, '-o', report_name], stdout=subprocess.PIPE, shell=False)
    (output, err) = p.communicate()
    p_status = p.wait()
    shutil.rmtree(report_name + '_files')
    if p_status == 0:
        try:
            return parse_scanjs_report(path, report_name + '.json')
        except Exception, e:
            return str(e)
    else:
        print 'scanjs_error %s' % (err)
        return 'error'

def parse_scanjs_report(app_path, report):
    total_issues = []
    file = open(report, "r")
    json_report = json.loads(file.read())
    for key, value in json_report.iteritems():
        js_issue = {}
        for issue in value:
            js_issue["warning_type"] = str(issue['rule']['threat'])
            js_issue["warning_code"] = ""
            js_issue["message"] = str(issue['rule']['desc'])
            js_issue["file"] = str(issue['filename']).replace(app_path, '')
            js_issue["line"] = str(issue['line'])
            js_issue["link"] = "N/A"
            js_issue["code"] = linecache.getline(issue['filename'], int(issue['line'])).strip(' \r\n\t')
            if len(js_issue['code']) > 100:
                js_issue['code'] = "too big to display, probably a compressed/minified javascript source."
            js_issue["severity"] = "Medium"
            js_issue["plugin"] = "javascript"
            js_issue["signature"] = base64.b64encode(str(issue['rule']['source']))
            js_issue["location"] = ''
            js_issue["user_input"] = ''
            js_issue["render_path"] = ''
        if js_issue:
            total_issues.append(js_issue)
    os.remove(report)
    return total_issues

def scan_brakeman(path):
    report_name = path + '/ror_scan_result.json'
    p = subprocess.Popen([bin_paths['brakeman'], '--path', path, '-q', '-A', '--absolute-paths', '--confidence-level', '2', '--output', report_name], stdout=subprocess.PIPE, shell=False)
    (output, err) = p.communicate()
    p_status = p.wait()
    if p_status == 0:
        try:
            return parse_brakeman_report(path, report_name)
        except Exception, e:
            return str(e)
    else:
        print 'brakeman_error %s' % (err)
        return 'error'

def parse_brakeman_report(app_path, report):
    total_issues = []
    file = open(report, "r")
    json_report = json.loads(file.read())
    items = json_report["warnings"]
    for item in items:
        ror_issue = {}
        ror_issue["warning_type"] = str(item['warning_type'])
        ror_issue["warning_code"] = str(item['warning_code'])
        ror_issue["message"] = str(item["message"])
        ror_issue["file"] = str(item["file"]).replace(app_path, '')
        ror_issue["line"] = str(item['line'])
        ror_issue["link"] = str(item['link'])
        ror_issue["code"] = str(item['code'])
        ror_issue["severity"] = str(item['confidence'])
        ror_issue["plugin"] = "rails"
        ror_issue["signature"] = str(item['fingerprint'])
        ror_issue["location"] = str(json.dumps(item['location']))
        ror_issue["user_input"] = str(item['user_input'])
        ror_issue["render_path"] = str(item['render_path'])
        total_issues.append(ror_issue)
    os.remove(report)
    return total_issues

def find_file(pattern, path):
    result = []
    for root, dirs, files in os.walk(path):
        for name in files:
            if fnmatch.fnmatch(name, pattern):
                result.append(os.path.join(root, name))
    return result

def scan_phprips(path):
    report_name = path + '/php_scan_result.html'
    p = subprocess.Popen([bin_paths['php'], '-f', bin_paths['rips'], 'loc=' + path, 'subdirs=1', 'verbosity=3', 'vector=server', 'treestyle=1', 'stylesheet=ayti', 'ignore_warning=1'], stdout=subprocess.PIPE, shell=False)
    (output, err) = p.communicate()
    p_status = p.wait()
    if p_status == 0:
        file = open(report_name, 'w')
        file.write(output)
        file.close()
        try:
            return parse_rips_report(path, report_name)
        except Exception, e:
            return str(e)
    else:
        print 'rips_error %s' % (err)
        return 'error'

def parse_rips_report(path, report_name):
    filenames = []
    issue_blocks = []
    p_issue_names = []
    p_issue_details = []
    total_issues = []
    
    soup = bs.BeautifulSoup(open(report_name, 'r'))
    html_filenames = soup.findAll('span', attrs={'class': 'filename'})
    
    for html_filename in html_filenames:
        filename = str(bs.BeautifulSoup(str(html_filename)).findAll('span', attrs={'class': 'filename'})[0].contents[0]).replace('File: ', '')
        filenames.append(filename)
    
    for filename in filenames:
        issue_block = soup.findAll('div', attrs={'id': filename})
        issue_blocks.append(issue_block)
    
    for issue_block in issue_blocks:
        p_issue_names.append(bs.BeautifulSoup(str(issue_block[0])).findAll('div', attrs={'class': 'vulnblocktitle'}))
        p_issue_details.append(bs.BeautifulSoup(str(issue_block[0])).findAll('div', attrs={'name': 'allcats'}))
    
    for i in range(0, len(p_issue_names)):
        for j in range(0, len(p_issue_details[i])):
            try:
                php_issue = {}
                userinputs = []
                php_issue["warning_type"] = str(bs.BeautifulSoup(str(p_issue_names[i])).findAll('div', attrs={'class':'vulnblocktitle'})[0].contents[0])
                php_issue["warning_code"] = ""
                
                line_number = int(str(bs.BeautifulSoup(str(p_issue_details[i][j])).findAll('span', attrs={'class':'linenr'})[0].contents[0]).replace(':',''))
                
                try:
                    included_file = str(bs.BeautifulSoup(str(p_issue_details[i][j])).findAll('span', attrs={'class':'linenr'})[0].parent.findNext('span', attrs={'class':'phps-t-comment'}).contents[0]).replace('// ', '')
                except AttributeError:
                    included_file = ''

                if len(included_file) > 0:
                    try:
                        php_issue["file"] = find_file(included_file, path)[0].replace(path, '')
                    except:
                        php_issue["file"] = ''
                    try:
                        php_issue["code"] = linecache.getline(find_file(included_file, path)[0], line_number).strip(' \r\n\t')
                    except:
                        php_issue["code"] = ''
                    php_issue["message"] = str(bs.BeautifulSoup(str(p_issue_details[i][j])).findAll('span', attrs={'class':'vulntitle'})[0].contents[0]).replace('Userinput', 'User input')
                    php_issue["message"] += ' Original File: ' + filenames[i].replace(path, '') 
                    try:
                        php_issue["message"] += " and included file: " + find_file(included_file, path)[0].replace(path, '')
                    except:
                        pass
                else:
                    php_issue["file"] = filenames[i].replace(path, '')
                    php_issue["code"] = linecache.getline(filenames[i], line_number).strip(' \r\n\t')
                    php_issue["message"] = str(bs.BeautifulSoup(str(p_issue_details[i][j])).findAll('span', attrs={'class':'vulntitle'})[0].contents[0]).replace('Userinput', 'User input')
    
                php_issue["line"] = line_number
                php_issue["link"] = ""
                
                php_issue["severity"] = "High"
                php_issue["plugin"] = "phpr"
                php_issue["signature"] = base64.b64encode(php_issue["warning_type"])
                php_issue["location"] = ""
                php_issue["user_input"] = []
                userinputs = bs.BeautifulSoup(str(p_issue_details[i][j])).findAll(attrs={'class':'userinput'})
                for userinput in userinputs:
                    count = 0
                    for linenr in bs.BeautifulSoup(str(userinput)).findAll('span', attrs={'class':'linenr'}):
                        count += 1
                        userinput_linenr = str(bs.BeautifulSoup(str(linenr)).findAll('span', attrs={'class':'linenr'})[0].contents[0]).replace(':', '')
                        php_issue["user_input"].append(int(userinput_linenr))
                php_issue["render_path"] = ""
                total_issues.append(php_issue)
            except:
                print traceback.print_exc()

    os.remove(report_name)
    return total_issues

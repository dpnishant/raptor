#!/usr/bin/python
import os, sys, hashlib, shutil
import pygit2 as git
import json as jsoner
from codescan import *
from externalscan import *
from fsb import *
from gitrob import *
from ebay_nodejs import *
import log


rulepacks = ['common', 'android', 'php', 'actionscript']
plugin_rulepacks = ['fsb_android', 'fsb_injection', 'fsb_crypto', 'fsb_endpoint', 'fsb_privacy', 'gitrob']

json = { 
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

def scan_all(scan_path, repo_path, repo_type):
    counter_start = time.clock()
    
    results = []
    js_results = []
    ror_results = []
    php_results = []
    fsb_results = []
    total_issues = 0

    start_time = time.strftime("%a, %d %b %Y %I:%M:%S %p", time.localtime())

    for rulepack in rulepacks:
        rule_path = 'rules/%s.rulepack' % rulepack
        report_path = scan_path + '/%s_report.json' % rulepack
        log.logger.debug('scanning with [%s] rulepack' % (rulepack))
        result = Scanner(scan_path, rule_path, report_path)

        if len(result.issues) > 0:
            for issue in result.issues:
                results.append(issue)
                total_issues += 1

    log.logger.debug("scanning with [gitrob] plugin")
    for rulepack in plugin_rulepacks:
        if rulepack.startswith('gitrob'):
            rule_path = 'rules/%s.rulepack' % rulepack
            gitrob_results = gitrob_scan(scan_path, rule_path)

            if len(gitrob_results) > 0:
                for issue in gitrob_results:
                    results.append(issue)
                    total_issues += 1

    log.logger.debug("scanning with [fsb] plugin")
    for rulepack in plugin_rulepacks:
        if rulepack.startswith('fsb_'):
            rule_path = 'rules/%s.rulepack' % rulepack
            fsb_results = fsb_scan(scan_path, rule_path)

            if len(fsb_results) > 0:
                for issue in fsb_results:
                    results.append(issue)
                    total_issues += 1

    log.logger.debug("scanning with [scanjs] plugin")
    js_results = scanjs(scan_path)
    if len(js_results) > 0 and js_results != 'error':
        for js_issue in js_results:
            results.append(js_issue)
            total_issues += 1
    
    log.logger.debug("scanning with [brakeman] plugin")
    ror_results = recur_scan_brakeman(scan_path)
    if len(ror_results) > 0 and ror_results != 'error':
        for ror_result in ror_results:
            results.append(ror_result)
            total_issues += 1

    log.logger.debug("scanning with [rips] plugin")
    php_results = scan_phprips(scan_path)
    if len(php_results) > 0 and php_results != 'error':
        for php_result in php_results:
            results.append(php_result)
            total_issues += 1

    log.logger.debug("scanning with [ebay-nodejs] plugin")
    ebay_nodejs_results = scan_ebay_nodejs(scan_path)
    if len(ebay_nodejs_results) > 0 and ebay_nodejs_results != 'error':
        for ebay_nodejs_result in ebay_nodejs_results:
            results.append(ebay_nodejs_result)
            total_issues += 1

    if repo_path[-4:len(repo_path)] == '.zip':
        for result in results:
            result['file'] = result['file'].replace(repo_path.rstrip('.zip'), repo_path)

    counter_end = time.clock()
    json["scan_info"]["app_path"] = repo_path
    json["scan_info"]["repo_type"] = repo_type
    json["scan_info"]["security_warnings"] = total_issues
    json["scan_info"]["start_time"] = start_time
    json["scan_info"]["end_time"] = time.strftime("%a, %d %b %Y %I:%M:%S %p", time.localtime())
    json["scan_info"]["duration"] = str(counter_end - counter_start)
    json["scan_info"]["version"] = "0.0.1"
    json["warnings"] = results
    json["ignored_warnings"] = ""
    json["errors"] = ""
    return json

def clone(repo_name, internal):
    clone_directory = os.environ['git_clone_dir']
    uniq_path = hashlib.sha224(repo_name).hexdigest()
    
    if os.path.isdir(os.path.join(clone_directory, uniq_path)):
        shutil.rmtree(os.path.join(clone_directory, uniq_path))

    if internal:
        repo_url = '%s/%s.git' % (os.environ['int_git_url'], repo_name)
    else:
        repo_url = '%s/%s.git' % (os.environ['ext_git_url'], repo_name)

    try:
        clone_dir = clone_directory
        if not os.path.isdir(clone_dir):
            os.makedirs(clone_dir)
        repo_path = os.path.join(clone_dir, uniq_path)

        if internal==True:
            username = os.environ['int_git_user']
            password = os.environ['int_git_token']
        else:
            username = os.environ['ext_git_user']
            password = os.environ['ext_git_token']

        login_info = git.UserPass(username, password)
        git_obj = git.clone_repository(repo_url, repo_path, credentials=login_info)            
        return repo_path
    except Exception, e:
        if str(e).find('Unexpected HTTP status code: 404'):
            log.logger.error("repo doesn't exists")
            return "Repo doesn't exists"
        log.logger.error(e)

def delete_residue(path, report_files):
    shutil.rmtree(path)

def start(repo_path, report_dir, internal):
    log.logger.debug("==============New Scan: [github] ===================")
    log.logger.debug("Now cloning: %s" % (repo_path))
    cloned_path = clone(repo_path, internal)
    if internal:
        repo_type = "internal"
    else:
        repo_type = "external"
    if os.path.isdir(cloned_path):
        log.logger.debug("[INFO] Now scanning: %s" % repo_path)
        results = scan_all(cloned_path, repo_path, repo_type)
        log.logger.debug("[INFO] Scan complete! Deleting ...")
        delete_residue(cloned_path, rulepacks)
        return results

def scan_zip(upload_id, zip_name, report_dir):
    log.logger.debug("==============New Scan: [zip] ===================")
    extracted_path = os.path.join(os.path.abspath(os.environ['zip_upload_dir']), upload_id)
    repo_type = "zip"
    if os.path.exists(extracted_path):
        log.logger.debug("Now scanning: %s" % zip_name)
        results = scan_all(extracted_path, zip_name, repo_type)
        log.logger.debug("Scan complete! Deleting ...")
        delete_residue(extracted_path, zip_name)
        return results
![Raptor](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/raptor_logo.png?raw=true "Raptor Logo")
 is a web-based (web-serivce + UI) github centric source-vulnerability scanner i.e. it scans a repository with just the github repo url. You can setup webhooks to ensure automated scans every-time you commit or merge a pull request. The scan is done asynchonously and the results are available only to the user who initiated the scan.

Some of the features of the Raptor:
  - Plug-in architecture (plug and play external tools and generate unified reports)
  - Web-service can be leveraged for custom automation (without the need of the UI) 
  - Easy to create/edit/delete signatures for new vulnerabilities and/or programming languages.

> This tool is an attempt to help the community and start-up companies to 
> emphasize on secure-coding. This tool may or may not match the features/quality of commercial alternatives, nothing is guaranteed and you have been warned. This tool is targeted to be used by security code-reviewers and/or developers with secure-coding experience to find vulnerability entry-points during code-audits or peer reviews. Please DO NOT trust the tool's output blindly.
> This is best-used if you plug Raptor into your CI/CD pipeline.

### Version
0.1 beta

### Tech

Integrated Plugins:

Note: Most of the following tools/modules/libs have been modified heavily to be able to integrate well in the framework.

* :zap: [Mozilla ScanJS](https://github.com/mozilla/scanjs) - for JavaScript (Client-Side, Node.JS etc. and upcomming support for Chrome Extensions & Firefox Plugins)
* :zap: [Brakeman](http://brakemanscanner.org/) - for Ruby On Rails
* :zap: [RIPS](http://rips-scanner.sourceforge.net/) - for PHP
* :zap: [Manitree](https://github.com/antitree/manitree/) - for AndroidManifest.xml insecurities

Available Rulepacks:
* :zap: ActionScript - supports Flash/Flex (ActionScript 2.0 & 3.0) source/sinks
* :zap: [FindSecurityBugs](http://h3xstream.github.io/find-sec-bugs/)  (rules Only) - for Java (J2EE, JSP, Android, Scala, Groovy etc.)
* :zap: [gitrob](https://github.com/michenriksen/gitrob) - for Sensitive Date Exposure (files containing credentials, configuration, backup, private settings etc.)

### Installation (Tested on a Ubuntu 14.04 x64 LAMP instance)

Installation Video: [YouTube Install](https://www.youtube.com/v/0KneQwJiUFk?start=0&end=537)

```sh
$ wget https://github.com/dpnishant/raptor/archive/master.zip -O raptor.zip
```

```sh
$ unzip raptor.zip
$ cd raptor-master
$ sudo sh install.sh
```

###Usage
#####Scanner
Installation Video: [YouTube Usage](https://www.youtube.com/v/0KneQwJiUFk?start=550)
```sh
cd raptor-master
sudo sh start.sh #starts the backend web-service
```
Now point your browser to [Raptor Home (http://localhost/raptor/)](http://localhost/raptor/)

######Login
Login with the username as registered on the corresponding github server you are connected to and *any* password (but remember the username to view scan history)

For example: 

If you are registered as `foobar` on https://github.com, then use the same username when scanning repos on https://github.com. However if are registered as `foobar_corp` on your personal/corporate github (say https://github.corp.company.com) then use the same username if you intend to scan repos on https://github.corp.company.com

However, as of now password can be anything, since we have *NOT* implemented a database in the development version.

#####Rules Editor
You can use the bundled light-weight, GUI client-side rules editor for adding any new/custom rule(s) for your specific requirements(s) or any other plain-text editor as the rulepack files are just simple JSON structures. Use your browser to open rules located in 'backend/rules'. When you are done, save your new/modified rules file in same directory i.e. 'backend/rules'. All you need to do now is a minor edit, here: [Init Script](https://github.com/dpnishant/raptor/blob/master/backend/raptor/init.py#L12). Append your new rulepack filename to this array without the '.rulepack' extension and restart the backend server. You are all set! :thumbsup:

You can access it here: [Rules Editor (http://localhost/raptor/editrules.php)](http://localhost/raptor/editrules.php)

#####Public/Private GitHub instance
You can use Raptor to scan your organization's private as well as public instances of GitHub by specifying the right server endpoints at [here](https://github.com/dpnishant/raptor/blob/master/start.sh#L9-L33) and [here](https://github.com/dpnishant/raptor/blob/master/frontend/session.php#L10-L11).

### Screenshots
#### Login
![Login](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/login.png?raw=true "Raptor Login")

#### Github Scan 
![Github Scan](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/scan.png?raw=true "Raptor Github Scan")

#### Zip Scan
![Zip Scan](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/zipscan.png?raw=true "Raptor Github Scan")

#### Scan Started
![Scan Started](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/scan_start.png?raw=true "Raptor Scan Start")

#### Scan in progress
![Scan in progress](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/progress.png?raw=true "Raptor Scan in Progress")

#### Report Statistics
![Report Statistics](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/stats.png?raw=true "Raptor Github Scan Stats")

#### Issue Details
![Login](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/issues.png?raw=true "Raptor Report Issues")

#### Export Report
![Export Report](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/export.png?raw=true "Raptor Report Export")

#### Scan History
![Scan History](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/history.png?raw=true "Raptor Github Scan")

#### Rules Editor
![Rules Editor](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/rules1.png?raw=true "Raptor Rules Editor #1")

#### Server Error
![Server Error](https://raw.githubusercontent.com/dpnishant/raptor/master/screenshots/error.png?raw=true "Raptor Server Error")

### Development

Want to contribute? Great! 
Get in touch with me if you have an idea or else feel free to fork and improve. :blush:

### Contributors

 - [Anant Shrivastava](https://twitter.com/anantshri) ([Commits](https://github.com/dpnishant/raptor/commits?author=anantshri))

License
----

GNU GPL v2.0

**Free Software, Hell Yeah!**

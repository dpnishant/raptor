# Raptor

Raptor is a web-based (web-serivce + UI) github centric source-vulnerability scanner i.e. it scans a repository with just the github repo url. You can setup webhooks to ensure automated scans everytime you commit or merge a pull request. The scan is done asynchonously and the results are available only to the user who initiated the scan.

Some of the features of the Raptor:
  - Plug-in architecture (plug and play external tools and generate unified reports)
  - Web-service can be leveraged for custom automation (without the need of the UI) 
  - Easy to create/edit/delete signatures for new vulnerabilities and/or programming languages.

> This tool is an attempt to help the community and start-up companies to 
> emphasize on secure-coding. This tool may or may not match the features/quality of commercial alternatives, nothing is guaranteed and you have been warned. This tool is targetted to be used by security code-reviewers and/or developers with secure-coding experience to find vulnerability entrypoints during code-audits or peer reviews. Please DO NOT trust the tool's output blindly.
> This is best-used if you plug Raptor into your CI/CD pipeline.

### Version
0.1 beta

### Tech

Integrated Plugins (_currently_):
* [Mozilla ScanJS] - for client-Side JavaScript, Node.JS, FireFox OS support
* [Brakeman] - for Ruby On Rails support
* [RIPS] - for PHP support
* [Android] - for insecure permissions

Avaiables Rulepacks (_currently_):
* ActionScript - supports ActionScript 2.0 & 3.0 source/sinks
* Java - partial support for Android. J2EE and JSP support yet to be added.

### Installation (Tested on a Ubuntu 14.04 x64 LAMP instance)

Installation Video: [YouTube Install]

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
Installation Video: [YouTube Usage]
```sh
cd raptor-master
sudo sh start.sh #starts the backend web-service
```
Now point your browser to [Raptor Home]

Login with *any* username and *any* password (but remember the username to view scan history)

#####Rules Editor
You can use the bundled light-weight, GUI client-side rules editor for adding any new/custom rule(s) for your specific requirements(s) or any other plain-text editor as the rulepack files are just simple JSON structures. Use your browser to open rules located in 'backend/rules'. When you are done, save your new/modified rules file in same directory i.e. 'backend/rules'. All you need to do now is a minor edit, here: [Init Script]. Append your new rulepack filename to this array without the '.rulepack' extension and restart the backend server. You are all set!

You can access it here: [Rules Editor]

### Development

Want to contribute? Great! 
Get in touch with me if you have an idea or else feel free to fork and improve. :)

### Contributors

 - [Anant Shrivastava]

License
----

GNU GPL v2.0

**Free Software, Hell Yeah!**

[Mozilla ScanJS]:https://github.com/mozilla/scanjs
[Brakeman]:http://brakemanscanner.org/
[RIPS]:http://rips-scanner.sourceforge.net/
[Anant Shrivastava]:https://twitter.com/anantshri
[YouTube Install]:https://www.youtube.com/v/0KneQwJiUFk?start=0&end=537
[YouTube Usage]:https://www.youtube.com/v/0KneQwJiUFk?start=550
[Init Script]:https://github.com/dpnishant/raptor/blob/master/backend/raptor_init.py#L9
[Rules Editor]:http://127.0.0.1/raptor/editrules.php
[Raptor Home]:http://127.0.0.1/raptor/

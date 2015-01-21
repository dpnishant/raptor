# Raptor

Raptor is a web-based (web-serivce + UI) source-vulnerability scanner that github centric i.e. it scans a repository with just the repo url. You can setup webhooks to ensure automated scans everytime you commit or merge a pull request. The scan is done asynchonously and the results are available only to the user who initiated the scan.

Some of the features of the Raptor:
  - Plug-in architecture (plug and play external tools and generate unified reports)
  - Web-service can be leveraged for custom automation (without the need of the UI) 
  - Easy to create/edit/delete signatures for new vulnerabilities and/or programming languages.

Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site] [1]:

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.

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

Installation Video: 

```sh
$ wget https://github.com/dpnishant/raptor/archive/master.zip -O raptor.zip
```

```sh
$ unzip raptor.zip
$ cd raptor-master
$ sh install.sh
```

###Usage
```sh
cd raptor-master
sh start.sh #starts the backend web-service
```
Now point your browser to http://127.0.0.1/raptor/

Login with *any* username and *any* password (but remember the username to view scan history)
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

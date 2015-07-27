#!/bin/bash
# Installs pip, cffi (requires libffi-dev), 
# libgit2 with SSH support (requires cmake, cffi, libssh-4 and/or libssh-dev); 
# python modules: pygit2, keyring, flask; 
# nodejs (required by Mozilla's scanjs); 
# brakeman
# beautifulsoup for parsing php-rips html report
raptor_path="$(pwd)"
echo "gem: --no-rdoc --no-ri" >> ~/.gemrc
echo "gem: --no-document" >> ~/.gemrc
apt-get update
apt-get upgrade
apt-get install -y git nginx apache2 php5 php5-curl php5-common libapache2-mod-php5 libapache2-mod-rpaf php5-mcrypt libffi-dev ruby php5-cli cmake libssh-4 libssl-dev linux-headers-generic build-essential autoconf libtool pkg-config python-pip python-opengl python-imaging python-pyrex python-pyside.qtopengl idle-python2.7 libgle3 python-dev python-dateutil python-docutils python-feedparser python-gdata python-jinja2 python-ldap python-libxslt1 python-lxml python-mako python-mock python-openid python-psycopg2 python-psutil python-pybabel python-pychart python-pydot python-pyparsing python-reportlab python-simplejson python-tz python-unittest2 python-vatnumber python-vobject python-webdav python-werkzeug python-xlwt python-yaml python-zsi
pip install cffi
wget https://codeload.github.com/libgit2/libgit2/tar.gz/v0.22.0 -O libgit2-0.22.0.tar.gz
tar xzf libgit2-0.22.0.tar.gz
cd libgit2-0.22.0/
cmake .
make install
ldconfig
cd ~
pip install pygit2==0.22.0
pip install keyring
pip install flask
pip install gunicorn
pip install beautifulsoup
pip install Django
curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install -y nodejs
gem install brakeman
cd $raptor_path
rm -rf libgit2-0.22.0.tar.gz
rm -rf libgit2-0.22.0/
mkdir -p /var/raptor/scan_results
chmod -R 777 /var/raptor/scan_results #development purpose only
mkdir -p /var/raptor/log
chmod -R 777 /var/raptor/log #development purpose only
mkdir -p /var/raptor/uploads
chmod -R 777 /var/raptor/uploads #development purpose only
mkdir -p /var/raptor/clones
chmod -R 777 /var/raptor/clones #development purpose only
mkdir -p /var/www/html/raptor
cp -r frontend/* /var/www/html/raptor
rm -rf /etc/apache2/sites-available/raptor.conf
rm -rf /etc/apache2/sites-enabled/raptor.conf
rm -rf /etc/nginx/sites-available/raptor
rm -rf /etc/nginx/sites-enabled/raptor
rm -rf /etc/nginx/sites-enabled/default
cp -r confs/apache2/* /etc/apache2
cp -r confs/nginx/* /etc/nginx
ln -s /etc/apache2/sites-available/raptor.conf /etc/apache2/sites-enabled/raptor.conf
ln -s /etc/nginx/sites-available/raptor /etc/nginx/sites-enabled/raptor
service apache2 restart
service nginx restart

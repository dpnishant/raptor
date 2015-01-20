#!/bin/bash

# This makes sure, that we don't deploy pull requests to gh-pages :-)
if [ $TRAVIS_PULL_REQUEST != false ];
then
  echo "Not deploying test-run for a pull request"
  exit 0
fi

(
 git init
 git config user.name "Travis-CI"
 git config user.email "travis@nodemeatspace.com"
 git add -v .
 git commit -v -m "Deployed to Github Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)

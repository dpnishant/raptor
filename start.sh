#!/bin/sh

export reportpath="/var/raptor/scan_results"
export zip_upload_dir="/var/raptor/uploads"
export git_clone_dir="/var/raptor/clones"

#IMPORTANT: Do NOT add the trailing slash after the URLs.
############PUBLIC###############
#your-public-github-endpoint-here
export ext_git_url="https://github.com"

#your-public-github-api-endpoint-here
export ext_git_apiurl="https://api.github.com"

#your-public-github-username-here
export ext_git_user="dpnishant"

#your-public-github-token-here
export ext_git_token="55230bdae78b690c187135e766a03a21d5e15d8c"


##############INTERNAL#############
#your-internal-github-endpoint-here
export int_git_url=""

#your-internal-github-api-endpoint-here
export int_git_apiurl=""  

#your-internal-github-username-here
export int_git_user=""

#your-internal-github-token-here
export int_git_token=""

cd backend
gunicorn -c config.py server:app

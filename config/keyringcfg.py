#!/usr/bin/python
import keyring

#Do NOT add the trailing slash after the endpoints.
keyring.set_password('ext_github', 'endpoint', 'https://github.com')          #your-public-github-endpoint-here
keyring.set_password('ext_github', 'api_endpoint', 'https://api.github.com')  #your-public-github-api-endpoint-here

keyring.set_password('int_github', 'endpoint', '')      #your-corp-github-endpoint-here
keyring.set_password('int_github', 'api_endpoint', '')  #your-corp-github-api-endpoint-here

keyring.set_password('ext_github', 'username', '')  #your-public-github-username-here
keyring.set_password('ext_github', 'token', '')     #your-public-github-token-here

keyring.set_password('int_github', 'username', '')  #your-corp-github-username-here
keyring.set_password('int_github', 'token', '')     #your-corp-github-token-here
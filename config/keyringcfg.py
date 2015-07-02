#!/usr/bin/python
import keyring
keyring.set_password('ext_github', 'username', '')  #your-public-github-username-here
keyring.set_password('ext_github', 'token', '')     #your-public-github-token-here

keyring.set_password('int_github', 'username', '')  #your-corp-github-username-here
keyring.set_password('int_github', 'token', '')     #your-corp-github-token-here

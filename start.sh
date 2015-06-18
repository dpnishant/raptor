#!/bin/sh
cd backend
gunicorn -c config.py server:app

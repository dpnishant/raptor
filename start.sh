#!/bin/sh
cd backend
gunicorn -c gunicorn_config.py server:app

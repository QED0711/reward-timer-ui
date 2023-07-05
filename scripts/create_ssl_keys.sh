#!/bin/bash

openssl req -nodes -new -x509 -keyout ./ssl/server.key -out ./ssl/server.cert
# openssl req -x509 -newkey rsa:4096 -keyout ./ssl/key.pem -out ./ssl/cert.pem -days 365

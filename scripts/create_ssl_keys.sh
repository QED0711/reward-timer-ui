#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <IP_ADDRESS>"
  exit 1
fi

IP=$1

openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 \
  -extensions SAN \
  -config <(cat /etc/ssl/openssl.cnf \
  <(printf "\n[SAN]\nsubjectAltName=IP:$IP")) \
  -keyout ssl/server.key \
  -out ssl/server.cert


# openssl req -nodes -new -x509 -keyout ./ssl/server.key -out ./ssl/server.cert -days 365
# openssl req -x509 -newkey rsa:4096 -keyout ./ssl/key.pem -out ./ssl/cert.pem -days 365

#!/bin/bash

docker run --rm -ti -d \
    --name reward_timer \
    -p 80:8000 \
    -p 443:8443 \
    -v $PWD/ssl/:/app/ssl \
    -v $PWD/server/auth.json:/app/server/auth.json \
    -v $PWD/server/db/:/app/server/db:z \
    reward_timer:latest
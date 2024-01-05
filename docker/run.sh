#!/bin/bash

docker run --rm -ti -d \
    --name reward_timer \
    -p 8000:8000 \
    -v $PWD/ssl/:/app/ssl \
    -v $PWD/server/auth.json:/app/server/auth.json \
    -v $PWD/server/db/:/app/server/db:z \
    reward_timer:latest

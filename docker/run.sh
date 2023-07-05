#!/bin/bash

docker run --rm -ti -d \
    --name reward_timer \
    -p 8000:8000 \
    -v $PWD/ssl/:/app/ssl \
    reward_timer:latest
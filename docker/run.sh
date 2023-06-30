#!/bin/bash

docker run --rm -ti -d \
    --name reward_timer \
    -p 8000:8000 \
    reward_timer:latest
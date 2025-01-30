#!/bin/bash

git pull origin main

chmod +x sysprint-server/start sysprint-server/dev sysprint-client/start sysprint-client/dev
# rm -rf sysprint-server/node_modules sysprint-client/node_modules

docker-compose up

#!/bin/sh

FILE=./.env.yaml
if ! test -f "$FILE"; then
    echo "Please set .env.yaml"
    exit 1;
fi

npm run build
gcloud app deploy

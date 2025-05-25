#!/bin/sh
set -e

MAIN_JS_FILE=$(find /usr/share/nginx/html -name "main*.js" | head -n 1)

if [ -n "$MAIN_JS_FILE" ]; then
  echo "Found main JavaScript file: $MAIN_JS_FILE"

  if [ -n "$API_URL" ]; then
    echo "Configuring API_URL: $API_URL"
    sed -i "s|API_URL:[\"'][^\"']*[\"']|API_URL:\"$API_URL\"|g" $MAIN_JS_FILE
  fi

  if [ -n "$API_PUBLIC_KEY" ]; then
    echo "Configuring API_PUBLIC_KEY: $API_PUBLIC_KEY"
    sed -i "s|API_PUBLIC_KEY:[\"'][^\"']*[\"']|API_PUBLIC_KEY:\"$API_PUBLIC_KEY\"|g" $MAIN_JS_FILE
  fi

  echo "Environment variable substitution completed"
else
  echo "WARNING: Main JavaScript file not found"
fi

exec "$@"

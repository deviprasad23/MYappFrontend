#!/usr/bin/env sh
# Start the React frontend (requires Node.js and npm)
cd "$(dirname "$0")"
if [ ! -f package.json ]; then
  echo "package.json not found. Please run this script from the myapp folder."
  exit 1
fi

echo "Running frontend on http://localhost:3000 ..."

npm start

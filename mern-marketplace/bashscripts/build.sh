#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$0")/.."
cd "$PROJECT_ROOT"

npm install

export NODE_OPTIONS=--openssl-legacy-provider
npm run build

DEPLOY_DIR="eb-deploy"
ZIP_NAME="mern-marketplace.zip"

rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

cp -r dist $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/

cd $DEPLOY_DIR
ZIP_EXE="/c/Program Files/7-Zip/7z.exe"
"$ZIP_EXE" a -tzip ../$ZIP_NAME ./*
cd ..

echo "Build and ZIP complete: $ZIP_NAME"

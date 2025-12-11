#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$0")/.."
cd "$PROJECT_ROOT"

npm install
export NODE_OPTIONS=--openssl-legacy-provider
npm run build

DEPLOY_DIR="eb-deploy"
ZIP_NAME="mern-marketplace.zip"

rm -rf "$DEPLOY_DIR"
mkdir "$DEPLOY_DIR"

cp -r dist "$DEPLOY_DIR/"

if [ -f server/server.js ]; then
  cp server/server.js "$DEPLOY_DIR/"
else
  exit 1
fi

cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/"

cd "$DEPLOY_DIR"
zip -r "../$ZIP_NAME" ./*
cd ..

S3_BUCKET_NAME="marketplace-final"
aws s3 cp "$ZIP_NAME" s3://"$S3_BUCKET_NAME"/"$ZIP_NAME"

VERSION_LABEL="v$(date +%Y%m%d%H%M%S)"

aws elasticbeanstalk create-application-version \
    --application-name "Mern-marketplace" \
    --version-label "$VERSION_LABEL" \
    --source-bundle S3Bucket="$S3_BUCKET_NAME",S3Key="$ZIP_NAME" \
    --no-cli-pager

aws elasticbeanstalk update-environment \
    --environment-name "Mern-marketplace-env" \
    --version-label "$VERSION_LABEL" \
    --no-cli-pager

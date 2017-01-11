#! /bin/bash

rm -rf dist
mkdir dist

./node_modules/.bin/babel index.js > dist/build.js
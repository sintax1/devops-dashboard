#!/bin/bash

cd

echo "Pulling latest dashboard code from http://craig.koroscil@stash.secure.myorg.com/scm/dev/devops-dashboard.git dashboard"

git clone http://craig.koroscil@stash.secure.myorg.com/scm/dev/devops-dashboard.git dashboard

cd dashboard

echo "Current Path: `pwd`"

#echo "Adding http/https proxy for package download"
#export http_proxy=http://apcwebproxy.secure.myorg.com:3128
#export https_proxy=http://apcwebproxy.secure.myorg.com:3128

echo "Running npm install"

npm install

echo "Running git submodule init"

git submodule init

echo "Running git submodule update"

git submodule update

echo "Running gulp build"

gulp build

echo "Running npm start in production mode"

npm start

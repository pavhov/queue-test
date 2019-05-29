#!/usr/bin/env bash

dir=$PWD;

cd $dir/initial-jobs && yarn && yarn run env && yarn run build
cd $dir/queue-service && yarn && yarn run env && yarn run build
cd $dir/users-service && yarn && yarn run env && yarn run build

#!/bin/bash

sleep 15
mongo testDB --eval "db.createUser({user:'$MONGODB_USER',pwd:'$MONGODB_PASS',roles:['readWrite']});"
export MONGODB_TEST_URI="mongodb://$MONGODB_USER:$MONGODB_PASS@127.0.0.1:$MONGODB_PORT/testDB"
export REDIS_TEST_URL="redis://127.0.0.1:$REDIS_PORT"

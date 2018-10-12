#!/bin/bash

npm test

git clone --single-branch -b $GIT_BRANCH --depth $GIT_DEPTH $GIT_URL $APP_DIR
chmod 777 -R .
cd $APP_DIR
npm install

sed "s/<URL for backend server>/https:\/\/$HEROKU_APP_URL/g" $DATA_FILE_PATH > data.js
if [ -s data.js ]
then
    rm $DATA_FILE_PATH
    cat data.js > $DATA_FILE_PATH
fi

npm run build

cp ./dist/index.html ../public
cp -r ./dist/static ../public
cd ..
rm -r $APP_DIR
rm -r test

git rm -r test/
git add public/index.html
git add public/static/
git commit -m "Travis CI-$TRAVIS_JOB_NUMBER( $TRAVIS_JOB_WEB_URL )"

npm cache clear &&
npm install -g grunt-cli mocha-phantomjs bower &&
bower cache clean &&
rm -rf app/bower* &&
rm -rf node_modules &&
npm install && 
npm install -g grunt-cli mocha-phantomjs &&
npm install bower &&
bower install &&
cwd=$(pwd)
cd ../
rm -rf ./od.server ./od.staff.server
git clone git@bitbucket.org:ddsapps/od.server.git && cd od.server && npm install && cd ../
git clone git@bitbucket.org:ddsapps/od.staff.server.git && cd od.staff.server && npm install && cd ../
cd cwd
npm link ../od.server ../od.staff.server
echo '##dev env installed.'

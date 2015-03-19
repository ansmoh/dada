'use strict';

var express = require("express")
, lessMiddleware = require("less-middleware")
, sassMiddleware = require('sass-middleware')
, app = express()
, authApp = require('../node_modules/od.staff.server/lib/app')()
, userApp = require('../node_modules/od.server/lib/App')()
, PatientApp = require('../node_modules/od.staff.server/lib/PatientApp')()
, FamilyMemberApp = require('../node_modules/od.staff.server/lib/FamilyMemberApp')()
, InsPlanApp = require('../node_modules/od.staff.server/lib/InsPlan')()
, InsSubApp = require('../node_modules/od.staff.server/lib/InsSub')()
, PatPlanApp = require('../node_modules/od.staff.server/lib/PatPlanApp')()
, AccountApp = require('../node_modules/od.staff.server/lib/AccountApp')()
, http = require('http')
, path = require('path')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, session = require('express-session')
, logger = require('morgan')
, unless = require('express-unless')
, argv = require('yargs').argv
, _ = require('lodash')
, port = parseInt(process.env.PORT, 10) || argv.port ||9000
, __appdir = path.resolve(__dirname, '../app')
, __testdir = path.resolve(__dirname, '../test')
// if(!argv.port)throw 'this script requires --port argument'
// app.use(logger())
app.use(sassMiddleware({
  src: __appdir
}))
app.use('/app', express.static(__appdir));
app.use('/', express.static(__appdir));
app.use('/test', express.static(__testdir));
app.use(cookieParser('spidey2015'))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(session(
  {secret: 'spidey2015'
  , key: 'sid'
  , cookie: {secure: false, maxAge: 60000}
  , saveUninitialized: true
  , resave: true
}))
app.get("/", function(req, res) {
  res.redirect('/index.html');
})
authApp.unless = unless
app.use('/', authApp.unless({
  path: [ '/test', '/app', '/index.html', /\/admin[\d\w\s\/\@\.]*/]
  , useOriginalUrl: true
}))
app.use('/admin', userApp)
app.use('/', PatientApp)
app.use('/', FamilyMemberApp)
app.use('/', InsPlanApp)
app.use('/', InsSubApp)
app.use('/', PatPlanApp)
app.use('/', AccountApp)
var server = http.createServer(app)
server.listen(port, function() {
  console.log('express server started on port %s', port);
})

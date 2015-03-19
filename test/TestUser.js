define([
  'superagent'
  , 'lodash'
  , 'controllers/AuthController'
  , 'async'
],
function( 
  request
  , _
  , AuthController
  , async
   ) {
    'use strict';
    var test_user = {
      practiceName: 'Your Family Dental'
      , Address: "111 Main St."
      , City: 'Vallejo'
      , State: "CA"
      , Zip: 99999
      , Phone: 7070000000
      , enabled: true
      , host: '0.0.0.0'
      , user: 'root@0.0.0.0'
      , password: 'root'
      , port: 3306
      , database: 'opendental'
      , staff_user: 'admin@test.com'
      , staff_pwd: 'test'
    }
  return {
    User: test_user
    , Save: function(done){
      request
      .post('/admin/users')
      .send(test_user)
      .auth('admin@ddsapps.com', 'Dental2014!')
      .withCredentials()
      .end(function(err, res){
        if(err)return done(err)
        if(res.error)
        return done(new Error(res.error))
        done(null, res.body)
      })
    }
    , Delete: function(done){
      done = done || _.noop
      request
      .del('/admin/users/'+test_user.user)
      .send(test_user)
      .auth('admin@ddsapps.com', 'Dental2014!')
      .withCredentials()
      .end(function(err, res){
        if(err)return done(err)
        if(res.error)
        return done(new Error(res.error))
        done(null, res.body)
      })
    }
    , LoginTestStaffUser: function(done){
        var self = this
        , auth = new AuthController()
        async.series([
          function(done){
            self.Save(done)
          }
          , function(done){
            var auth = new AuthController()
            , opts = {
              user: self.User.staff_user
              , password: self.User.staff_pwd
            }
            auth.loginWCredentials(opts, done)
          }
          ], function(err){
            if(err)return done(err)
            done(null)
          })
    }
  }
});

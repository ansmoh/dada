define([
    'backbone'
    ,'commands'
    ,'reqres'
    ,'qs'
    ,'_s'
    ,'vent'
    ,'lodash'
    ,'superagent'
  ],
  function(
    Backbone
    , commands
    , reqres
    , qs
    , _s
    , vent
    , _
    , request
    ) {
    var adminLoginUrl  = '/adminlogin'
    , LoginUrl = '/login'
    return Backbone.Marionette.Controller.extend({

      initialize: function(options) {
        commands.setHandler('auth:login', this._login)
        commands.setHandler('auth:logout', this._logout)
        reqres.setHandler('account', this._account)
        reqres.setHandler('auth:isloggedin', this._isloggedin)
      }
      , _account: function(){
        var account = window.localStorage.getItem('account')||''
        if(account.indexOf('{')> -1)
        account = JSON.parse(account)
        return account
      }
      , loginWCredentials: function(options, done){
        if(_.isFunction(options))
        throw 'missing options.'
        done = done || _.noop
        options = options||{}
        options.url = options.url || LoginUrl
        options.url = this.Url(options.url)
        request
        .post(options.url)
        .auth(options.user, options.password)
        .end(function(err, res){
          if(err)return done(err)
          window.localStorage.setItem('demo', false)
          window.localStorage.setItem('Authorization', res.req.header.Authorization)
          done(null, res.req.header.Authorization)
        })
      }
      , Url: function(url){
        if(window._host)
        return window._host+url
        return url
      }
      , _logout: function(){
        window.localStorage.setItem('Authorization', null)
        window.localStorage.setItem('account', null)
        Backbone.history.navigate('!login', {trigger: true})
      },
      _login: function() {
      if(window.localStorage.getItem('Authorization')||window.localStorage.getItem('demo')=='true')return
        Backbone.history.navigate('!login', {trigger: true})
      }
      ,_isloggedin:function(){
      }
    });

  });

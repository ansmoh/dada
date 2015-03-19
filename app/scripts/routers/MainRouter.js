define([
    'backbone',
    'controllers/MainController',
    'reqres'
    , 'vent'
    , 'commands'
],
  function (
    Backbone
    , MainController
    , reqres
    , vent
    , commands
    ) {
    'use strict';
    return Backbone.Marionette.AppRouter.extend({
        /* Backbone routes hash */
    appRoutes: {
       '!':'home'
      ,'':'home'
      , '!?*query':'home'
      , '!confirmation':'confirmation'
      , '!form/:formUrl':'form'
      , '!form/:formUrl?*query':'form'
      , '!formseries*query':'form'
      , '!formseries?*':'form'
      , '!formseries?*query':'form'
      , '!formcompletion*query':'formcompletion'
      , '!login':'login'
      , '*path':'home'
    },

    initialize: function(options) {
      this.controller = new MainController()
      var self = this
      reqres.setHandler('router', function(){
        return self
      })
      vent.on('search', this._search, this)
      this.on('route', function(route){
        vent.trigger('route', route)
        self._currentRoute = route
      })
    }, 
    _search:function(){
      if(this._currentRoute != 'schedule')
      this.navigate('', {trigger: true})
    }
  });
});
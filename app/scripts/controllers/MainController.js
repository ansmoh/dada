define([
    'backbone'
    ,'regionManager'
    ,'reqres'
    ,'views/layout/AppLayout'
    ,'qs'
    ,'vent'
    , 'views/item/LoginView'
    , 'commands'
    , 'views/item/ControlPanelView'
    , 'views/layout/FormLayout'
    , 'views/item/FormCompletionView'
    , 'views/item/ConfirmationView'
],
  function (Backbone
    , regionManager
    , reqres
    , AppLayout
    , qs
    , vent
    , LoginView
    , commands
    , ControlPanelView
    , FormLayout
    , FormCompletionView
    , ConfirmationView
    ) {

      'use strict';
      return Backbone.Marionette.Controller.extend({

          initialize: function (options) {
              /*
              get the application region manager, which is available on the global reqres
               */
              this._regionManager = reqres.request('app:regionmanager')
              /*
              get the app layout region which will be used for loading the main application view
               */
              this._region = this._regionManager.get('app_layout')
              this._appLayout = reqres.request('app:layout')
              this.page_content_region = this._regionManager.get('page_content')
              this.page_content_region = this._appLayout.page_content
          }
          ,home: function(query){
            var self = this
            this.page_content_region.close()
            if(!window.localStorage.getItem('Authorization'))
            return Backbone.history.navigate('!login', {trigger:true})
            self.page_content_region.show(new ControlPanelView())
            this.enableLogoutLink()
          }
          ,confirmation: function(){
            var self = this
            this.page_content_region.close()
            if(!window.localStorage.getItem('Authorization'))
            return Backbone.history.navigate('!login', {trigger:true})
            self.page_content_region.show(new ConfirmationView())
            this.enableLogoutLink()
          }
          ,form: function(formUrl){
            var self = this
            this.page_content_region.close()
            if(!window.localStorage.getItem('Authorization'))
            return Backbone.history.navigate('!login', {trigger:true})
            self.page_content_region.show(new FormLayout({formUrl: formUrl}))
            this.enableLogoutLink()
          }
          ,formcompletion: function(formUrl){
            console.log(formUrl);
            var self = this
            this.page_content_region.close()
            if(!window.localStorage.getItem('Authorization'))
            return Backbone.history.navigate('!login', {trigger:true})
            self.page_content_region.show(new FormCompletionView())
            this.enableLogoutLink()
          }
          ,login:function(){
            this.page_content_region.close()
            this.page_content_region.show(new LoginView())
            this.disableLogoutLink()
          }
          ,_restoreAppState: function (state) {
              state = state || ''

              if (state.match(/signin/)) state = ''

              Backbone.history.navigate(state, {
                  trigger: true
              })
          }
          , disableLogoutLink: function(){
            $('#logout').hide()
            $('#navbar').hide()
          }
          , enableLogoutLink:function(){
            $('#logout').show() 
            $('#navbar').show() 
          }
          /**
           * set the current controller
           * @param {Backbone.Controller} controller
           */
          ,_setCurrentMainController: function (controller) {
              this._currentController && this._currentController.close()
              this._currentController = controller
          }
      });

  });
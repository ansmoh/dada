define([
    'backbone'
    ,'hbs!tmpl/layout/AppLayout_tmpl'
    ,'hbs!tmpl/item/PracticeInfo_tmpl'
    ,'reqres'
    ,'regionManager'
    , 'mixin/Query'
    , 'lodash'
    , 'vent'
    , 'superagent'
    , 'commands'
    , 'models/Account'
],
  function (
    Backbone
    , ApplayoutTmpl
    , PracticeInfo_tmpl
    , reqres
    , regionManager
    , query
    , _
    , vent
    , request
    , commands
    , Account
    ) {
      'use strict';
     
      /* Return a Layout class definition */
      return Backbone.Marionette.LayoutView.extend({

          initialize: function(options) {
            this.options = options || {}
            _.extend(this, query)
            this._regionManager = reqres.request('app:regionmanager')
            this.excludedkeys=[37,38,39,40]
            //determine if user is logged in
            // this._regionManager.addRegion('page_content', '#page-content')
            this._isloggedin = reqres.request('auth:isloggedin')
            vent.on('route', this._activateTab)
            vent.on('auth:login', this._updateHeader.bind(this))
            this._activateTab()
            this.initAccount()
          }

          ,template: ApplayoutTmpl,

          /* Layout sub regions */
          regions: {
              page_content: '#page_content'
          },

          /* ui selector cache */
          ui: {},

          /* Ui events hash */
          events: {
            'click button.pull-left':'_back'
            , 'click button.pull-right': '_forward'
            , 'click #logout':'_logout'
          }
          , initAccount: function(){
            this._account = this._account || new Account()
            this._account.on('sync', this._updateHeader.bind(this))
            this._account.fetch()
          }
          , _updateHeader: function(){
            var account = this._account.toJSON()
            var pInfo = PracticeInfo_tmpl(account)
            //render practice name
            this.$el.find('#practiceName').html(account.practiceName)
            this.$el.find('#PracticeInfo').html(pInfo)
          }
          , _logout: function(e){
            e.preventDefault()
            commands.execute('auth:logout')
          }
          , _back: function(e){
            e.preventDefault()
            window.history.back()
          }
          , _forward: function(e){
            e.preventDefault()
            window.history.forward()
          }
          ,_activateTab: function(route){
            if(!route)route='schedule'
            this.$bar = this.$bar || $('.bar.bar-tab')
            if(route=='login') return this.$bar.addClass('hidden')
            this.$bar.removeClass('hidden')
            this.$bar.find('.tab-item').removeClass('active')
            this.$bar.find('.tab-item').each(function(tab){
              tab = $(this)
              tab = tab.attr('href')
              if(tab.indexOf(route) >-1)
              $(this).addClass('active')
            })
          } 
          /* on render callback */
          , onRender: function() {
              var self = this
              this._updateHeader()
          }
      });

  });
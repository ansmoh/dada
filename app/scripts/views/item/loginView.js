define([
	'backbone',
	'hbs!tmpl/item/loginView_tmpl'
  , 'superagent'
  , 'commands'
  , 'lodash'
  , 'vent'
],
function( 
  Backbone
  , LoginviewTmpl
  , request
  , commands
  , lodash
  , vent
    ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
		},
		
    	template: LoginviewTmpl,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {
      'click #login_btn':'_login'
    }
    , _login:function(e){
      e.preventDefault()
      this.$login = this.$login || this.$el.find('form')
      var username = this.$login.find('[name=username]').val()
      , password = this.$login.find('[name=password]').val()
      request
      .post(window._host+'/login')
      .auth(username, password)
      .end(function(err, res){
        if(err)return console.log(err)
        window.localStorage.setItem('account', JSON.stringify(res.body))
        window.localStorage.setItem('demo', false)
        window.localStorage.setItem('Authorization', res.req.header.Authorization)
        vent.trigger('auth:login', res.body)
        Backbone.history.navigate('', {trigger: true})
      })
    }
		/* on render callback */
		,onRender: function() {
    }
	});

});

define([
		'backbone'
		, 'communicator'
		, 'routers/MainRouter'
		, 'reqres'
		, 'controllers/AuthController'
		, 'views/layout/AppLayout'
		, 'commands'
		, 'controllers/FormController'
		, 'backbone.auth'
	],

	function(
		Backbone
		, Communicator
		, MainRouter
		, reqres
		, AuthController
		, AppLayout
		, commands
		, FormController
		) {
		'use strict';
		(function() {
		  var proxiedSync = Backbone.sync;

		  Backbone.sync = function(method, model, options) {
		    options || (options = {});

		    if (!options.crossDomain) {
		      options.crossDomain = true;
		    }

		    if (!options.xhrFields) {
		      options.xhrFields = {withCredentials:true};
		    }
		    options.beforeSend = function(xhr) {
	        xhr.setRequestHeader('Authorization', window.localStorage.getItem('Authorization'));
	        // if (beforeSend) return beforeSend.apply(this, arguments);
	      };
		    return proxiedSync(method, model, options);
		  };
		})();
		
		var App = new Backbone.Marionette.Application();

		App._getRegionManger = function() {
		this._regionManager || new Backbone.Marionette.RegionManager()
		return this._regionManager 
		}
		/* Add application regions here */
		App.addRegions({
			app_layout: '#app_layout'
		});
		App._getAppLayout = function() {
			return this._appLayout
		}

		/* Add initializers here */
		App.addInitializer(function() {
			if(!window._development)
			window._host = '/fapi'
			reqres.setHandler('app:layout', this._getAppLayout.bind(this))
			reqres.setHandler('app:regionmanager', this._getRegionManger.bind(this))
			this._authController = new AuthController()
			this._formController = new FormController()
			this._appLayout = new AppLayout()
			this.app_layout.show(this._appLayout)
			this._router = new MainRouter();
			Backbone.history.start({
			    pushState: false
			});
			// Backbone.history.start('login');
			commands.execute('auth:login')
		});
		return App;
	});
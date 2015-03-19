define([
	'backbone',
	'hbs!tmpl/item/FormCompletionView_tmpl'
  , 'superagent'
  , 'commands'
  , 'lodash'
  , 'vent'
],
function( 
  Backbone
  , FormCompletionView_tmpl
  , request
  , commands
  , lodash
  , vent
    ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function(options){
      console.log(options);
		},
		
    	template: FormCompletionView_tmpl,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {
    }
		/* on render callback */
		,onRender: function() {
    }
	});

});

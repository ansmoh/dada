define([
	'backbone'
	, 'hbs!tmpl/item/ConfirmationView_tmpl'
	, 'lodash'
	, '_s'
	, 'reqres'
	, 'qs'
	, 'jquery-backstretch'
],
function(
	Backbone
	, ConfirmationView_tmpl
	, _
	, _s
	, reqres
	, qs
	  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
		},
		
  	template: ConfirmationView_tmpl,
      

  	/* ui selector cache */
  	ui: {},

		/* Ui events hash */
		events: {
			'click #confirmation_button_add_family_member':'addFamilyMember'
		}
		, addFamilyMember: function(e){
			e.preventDefault()
			//trigger adding form to form group.
		}
		, onClose: function(){
			console.log('onClose');
		}
		/* on render callback */
		, onRender: function() {
			this.$bg = this.$el.find('#thank_you_bg')
			if(window._development)
			return this.$bg.backstretch('img/thankyou.jpg');
			this.$bg.backstretch('forms/img/thankyou.jpg');
		}
	});
});

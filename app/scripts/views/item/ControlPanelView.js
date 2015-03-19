define([
	'backbone'
	, 'hbs!tmpl/item/ControlPanelView_tmpl'
	, 'hbs!tmpl/item/ControlPanelButton_tmpl'
	, 'lodash'
	, '_s'
	, 'reqres'
	, 'qs'
],
function( 
	Backbone
	, Controlpanelview_Tmpl
	, ControlPanelButton_tmpl
	, _
	, _s
	, reqres
	, qs
	  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			this._forms = reqres.request('forms')
		},
		
  	template: Controlpanelview_Tmpl,
      

  	/* ui selector cache */
  	ui: {},

		/* Ui events hash */
		events: {	
			'keyup .form-search>input[name=search]': '_search_keyup'
		}
		, _search_keyup: function(e){
			this.$search = this.$search||this.$el.find('input[name=search]')
			this.trigger('search', this.$search.val())
		}
		, _search: function(e){
			e = _.filter(this._forms, function(f){
				var fname = f.prototype.formName.toLowerCase()
				return fname.indexOf(e)>-1
			})
			this._renderFormButtons(e)
		}
		, formShortCuts: function(){
			return [{
				prototype:{
					formName: 'Click here to complete dental forms'
					, urlRoot: 'formseries'
					, forms: [
						'patient'
						, 'familymember'
						, 'InsuranceInformation'
						, 'PatientInfoConfirmation'
					]
					, _url: function(){
						var query = {
							forms: this.forms
						}
						query = this.urlRoot + '?'+qs.stringify(query)
						return query
					}
				}
			}]
		}
		, _renderFormButtons: function(forms){
			var self = this
			forms=forms||this._forms
			forms = _.union(forms, this.formShortCuts())
			this.$controlPanelGrid = this.$controlPanelGrid|| this.$el.find('#control-panel-grid')
			this.$controlPanelGrid.html('')
			forms.forEach(function(form){
				if(form.prototype.formIsVisible==false)return;
				var button = ControlPanelButton_tmpl(form.prototype)
				button = $(button)
				button.find('.form-name').html(form.prototype.formName)
				if(form.prototype._url)
				button.attr('href', _s.sprintf('#!%s', form.prototype._url()))
				else	
				button.attr('href', _s.sprintf('#!form%s', form.prototype.urlRoot))
				//apply style property
				button.find('button').attr('style', form.prototype.style)
				self.$controlPanelGrid.append(button)
			})
		}
		/* on render callback */
		, onRender: function() {
			this.on('search', this._search)
			this._renderFormButtons()
		}
	});
});

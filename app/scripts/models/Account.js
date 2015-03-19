define([
	'backbone'
    , 'backbone.auth'
],
function( 
  Backbone
   ) {
    'use strict';
    var url = '/account'
	/* Return a model class definition */
	return Backbone.Model.extend({
		initialize: function() {
            this.Url()
        }
        , Url: function(){
            if(window._host)
            return this.urlRoot = window._host+url
            this.urlRoot = url
        }
		,defaults: {
      // enabled: true
    }
    , idAttribute: 'user'
    // , schema: {
    //   // enabled: ''
    //   user: {type:'Text', validators:['required'], editorClass: 'form-control'}
    //   ,practiceName: {type:'Text', validators:['required'], editorClass: 'form-control'}
    //   ,host: {type:'Text', validators:['required'], editorClass: 'form-control'}
    //   ,password: {type:'Text', editorClass: 'form-control'}
    //   ,port: {type:'Text', editorClass: 'form-control'}
    //   ,database: {type:'Text', validators:['required'], editorClass: 'form-control'}
    // }
    });
});

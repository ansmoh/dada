define([
  'backbone'
  , 'backbone.auth'
],
function( 
  Backbone
   ) {
    'use strict';

  /* Return a model class definition */
  return Backbone.Model.extend({
    initialize: function() {
    }
    ,urlRoot:'/users'
    ,defaults: {
      enabled: true
    }
    , idAttribute: 'id'
    , schema: {
      // enabled: ''
      user: {type:'Text', validators:['required'], editorClass: 'form-control'}
      ,practiceName: {type:'Text', validators:['required'], editorClass: 'form-control'}
      ,password: {title: 'password', type:'Text', validators:['required'], editorClass: 'form-control'}
      ,_password: {title: 'confirm password', type:'Text', validators:['required', {type:'match', field:'password', message:'Passwords must match!'}], editorClass: 'form-control'}
      ,host: {type:'Text', validators:['required'], editorClass: 'form-control'}
      ,port: {type:'Text', editorClass: 'form-control'}
      ,database: {type:'Text', validators:['required'], editorClass: 'form-control'}
    }
    });
});

define([
  'backbone'
  , '_s'
  , 'hbs!tmpl/item/FamilyMemberForm_tmpl'
  , 'lodash'
  , 'bootstrapTemplates'
  , 'backbone.epoxy'
],
function( 
  Backbone
  , _s
  , FamilyMemberForm_tmpl
  , _
   ) {
    'use strict';

  /* Return a model class definition */
  return Backbone.Epoxy.Model.extend({
    initialize: function() {
      this.urlRoot = this.urlBase()+this.urlRoot
      this.template = _.template(FamilyMemberForm_tmpl())
      // console.log(this.template);
    }
    , template : _.template(FamilyMemberForm_tmpl())
    , urlBase: function(){
      return window._host
    }
    , urlRoot: '/familymember'
    , formName: 'Family Form'
    ,defaults: {
    }
    , computeds:{
      
    }
    , idAttribute: 'PatNum'
    , schema: {
       SSN: {title: 'Social Security Number', type:'Text', validators:['required', {type: 'regexp', regexp: /^\d{9}$/, message:'Valid SSN required.'}], editorClass: 'form-control'}
      , FName: {title: 'First Name', type:'Text', validators:['required'], editorClass: 'form-control'}
      , MiddleI: {title: 'Middle Initial', type:'Text', validators:['required'], editorClass: 'form-control'}
      , LName: {title: 'Last Name', type:'Text', validators:['required'], editorClass: 'form-control'}
      , gSSN: {title: 'Social Security Number', type:'Text', validators:['required', {type: 'regexp', regexp: /^\d{9}$/, message:'Valid SSN required.'}], editorClass: 'form-control'}
      , gFName: {title: 'First Name', type:'Text', validators:['required'], editorClass: 'form-control'}
      , gMiddleI: {title: 'Middle Initial', type:'Text', validators:['required'], editorClass: 'form-control'}
      , gLName: {title: 'Last Name', type:'Text', validators:['required'], editorClass: 'form-control'}
    }
    });
});

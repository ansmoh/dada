define([
  'backbone'
  , '_s'
  , 'lodash'
  , 'bootbox'
  , 'mixin/Query'
  , 'bootstrapTemplates'
  , 'backbone.epoxy'
  , 'backbone.auth'
],
function( 
  Backbone
  , _s
  , _
  , bootbox
  , query
   ) {
    'use strict';
  /* Return a model class definition */
  return Backbone.Epoxy.Model.extend({
     initialize: function(options) {
      options = options||{}
      delete this.attributes.formLayout
      this.initFormLayout(options)
      this.urlRoot = this.urlBase()+this.urlRoot
      _.extend(this, query)
      this.on('form:set', this._initForm.bind(this))
      window._currentForm = this
    }
    , initFormLayout: function(options){
      this._formLayout = options.formLayout||{}
      this._formLayout.trigger=this._formLayout.trigger||_.noop
    }
    , _initForm: function(){
        console.log('implement _initForm');
    }
    , _formChanged: function(){
      console.log('implement _formChanged');
    }
    , urlBase: function(){
      return window._host
    }
    , _saveSuccess: function(){
      this.trigger('save:success', {PatNum: this.get('PatNum')})
    }
    , _saveError: function(err){
      this.trigger('save:error', err) 
    }
    , _parseModel: function(Patient){

    }
    , _requestResult: function(err, res, done){
        err = err || new Error(res.error)
        if(err){
          return done(err) //error;
        }
        done(null, res.body)
      }
    , removeFields: function(fields){
      var self = this
      this._hiddenFields = this._hiddenFields||{}
      this._hiddenValues = this._hiddenValues||{}
      fields.forEach(function(f){
        self._hiddenFields[f] = self._form.fields[f]
        self._hiddenValues[f] = self.attributes[f]
        delete self.attributes[f]
        delete self._form.fields[f]
      })
    }
    , restoreFields: function(){
      var self = this
      if(!this._form)throw "this._form isn't set"
      this._hiddenFields = this._hiddenFields||{}
      this._hiddenValues = this._hiddenValues||{}
      _.keys(this._hiddenFields).forEach(function(f){
        self._form.fields[f] = self._hiddenFields[f]
        self.attributes[f] = self._hiddenValues[f]
      })
      this.clearHiddenFields()
    }
    , clearHiddenFields: function(){
      this._hiddenFields = {}
      this._hiddenValues = {}
    }
    , validate: function(attrs, done){
      console.log('implement validate');
      if(!done)return;
      done(null)
    }
    , removeFormFromQueue: function(FormName){
      this._formLayout.trigger('formlayout:removeFromQueue', FormName)
    }
    , addFormToQueue: function(FormName){
      this._formLayout.trigger('formlayout:addFormToQueue', FormName)
    }
    , _errorModal: function(err){
      err = err || "There was an error submitting your information."
      if(!_.isString(err))
      err = err.toString()
      bootbox.alert(err);
    }
    , validateObject: function(obj, field, value){
      obj=obj||{}
      field = obj[field]
      if(field==undefined || value==undefined)return;
      field = field.toLowerCase()
      value = value.toLowerCase()
      if(field == value)return;
      return 'Invalid'
    }
  });
});

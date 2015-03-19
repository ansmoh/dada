define([
  'backbone'
  , '_s'
  , 'hbs!tmpl/item/PatientInfoConfirmationForm_tmpl'
  , 'lodash'
  , 'superagent'
  , 'models/FormBase'
  , 'async'
  , 'bootstrapTemplates'
  , 'backbone.epoxy'
],
function( 
  Backbone
  , _s
  , PatientInfoConfirmationForm_tmpl
  , _
  , request
  , FormBase
  , async
   ) {
    'use strict';
  /* Return a model class definition */
  return FormBase.extend({
     initialize: function() {
      this.on('save', this._save)
      this.on('form:rendered', this.formRendered)
      this.on('form:set', this._initForm)
      this.__proto__.__proto__.initialize.apply(this, arguments);
    }
    , template: _.template(PatientInfoConfirmationForm_tmpl())
    , urlRoot: '/PatientInfoConfirmation'
    , formName: 'Information Confirmation'
    , formIsVisible: false
    /**
     * Initialize form events
     * @return {}
     */
    // , _initForm: function(){
    //     var self = this
    //     self._form.on('change', self._formChanged.bind(self))
    //   }
    , _initForm: function(){
      var self = this
      self._form.on('change', self._formChanged.bind(self))
    }
    , addNewFamilyMemberFormToQueue: function(){
      this.addFormToQueue('AddFamilyMember')
      this._formLayout.trigger('formlayout:nextform')
    }
    , formRendered: function(){
      this.$addFamilyMemberBtn = this._form.$el.find('#confirmation_button_add_family_member')
      this.$addFamilyMemberBtn.click(this.addNewFamilyMemberFormToQueue.bind(this))
      this._form.trigger('form:valid')
    }
    /**
     * Show/Hide Subscriber fields depending on whether the patient is adding self as the subscriber.
     * @param  {Form}
     * @return {}
     */
    , _formChanged: function(form){
      console.log('implement _formChanged');
    }
    , validate: function(attrs, done) {
      var self = this
      if(!done)throw 'missing callback'
      attrs = attrs = this.attributes
      var errs = {};
      async.series([
        // function(done){
        //   if(!attrs.patSSN)return done(null)
        //   self.validateSSN({SSN: attrs.patSSN, attr:'patSSN'}, function(err, result){
        //     if(err){
        //       errs.patSSN = _invalidSSNStr
        //       return done(null)
        //     }
        //     self._patient = result
        //     done(null)
        //   })
        // }
        // , function(done){
        //   if(!attrs.subSSN)return done(null)
        //   self.validateSSN({SSN: attrs.subSSN, attr:'subSSN'}, function(err, result){
        //     self._subscriber = result
        //     if(err){
        //       errs.subSSN = _invalidSSNStr
        //       return done(null)
        //     }
        //     done(null)
        //   })
        // }
        ], function(err){
          if(err)return done(null, errs)
          self._form.trigger('form:valid')
          done(null, errs)
        })
    }
    , _save: function(){
      this.trigger('save:success')
    }
    , defaults: {

      }
    , schema: {

    }
  });
});

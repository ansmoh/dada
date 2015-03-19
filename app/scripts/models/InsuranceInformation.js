define([
  'backbone'
  , '_s'
  , 'hbs!tmpl/item/InsuranceInformationForm_tmpl'
  , 'lodash'
  , 'superagent'
  , 'models/InsuranceInformationBase'
  , 'views/forms/input/TextAutoComplete'
  , 'async'
  , 'hbs!tmpl/item/PatientInfo_tmpl'
  , 'bootstrapTemplates'
  , 'backbone.epoxy'
  , 'backbone.auth'
],
function( 
  Backbone
  , _s
  , InsuranceInformationForm_tmpl
  , _
  , request
  , InsuranceInformationBase
  , TextAutoComplete
  , async
  , PatientInfo_tmpl
   ) {
    'use strict';
  /* Return a model class definition */
  var _invalidSSNStr = 'This patient does not exist. Please register this patient before filling out this form.'
  , fields = ['subFName', 'subLName', 'subMiddleI', 'subSSN']
  , patFields = ['patFName', 'patLName', 'patMiddleI', 'patSSN']
  return InsuranceInformationBase.extend({
     initialize: function() {
      this.on('save', this._saveInsFromGroupNameNumber)
      this.on('patient', this._onPatient)
      this.on('subscriber', this._onSubscriber)
      this.on('form:rendered', this.renderPatientFields)
      this.on('form:rendered', this.renderSubscriberFields)
      this.on('form:set', this._initForm)
      this.__proto__.__proto__.initialize.apply(this, arguments);
    }
    , template: _.template(InsuranceInformationForm_tmpl())
    , urlRoot: '/InsuranceInformation'
    , formName: 'Insurance Policy'
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
    /**
     * Show/Hide Subscriber fields depending on whether the patient is adding self as the subscriber.
     * @param  {Form}
     * @return {}
     */
    , _formChanged: function(form){
      form.model.set(form.getValue())
      if(form.fields['patSSN']&&form.fields['subSSN']){
        if(form.getValue('patSSN')&&form.getValue('subSSN'))return;
      }
      //check if Relationship changed and hide/show Subscriber Information as needed
      this.renderSubscriberFields()
    }
    , renderSubscriberFields: function(){
      var form = this._form
      this.$subInfo = this.$subInfo || this._form.$el.find('#subInfo')
      this.getPatient()
      if(form.model.get('Relationship')==0){
        this.removeFields(fields)
        this.$subInfo.hide()
        this._subscriber = this._patient
      }
      else{
      this.restoreFields()
      this.$subInfo.show()
      if(this._patient)
      this.renderPatientFields()
      }
    }
    /**
     * Initialize Patient Info if _patient set.
     * @return {[type]} [description]
     */
    , renderPatientFields: function(){
      console.log('renderPatientFields');
      if(!this._form)throw 'Form not set.'
      if(!this._patient)return;
      if(!this._patient.PatNum)return
      this.removeFields(patFields)
      var $pat_fields = this._form.$el.find('#pat_fields')
      $pat_fields.html(PatientInfo_tmpl(this._patient))
    }
    , validate: function(attrs, done) {
      var self = this
      if(!done)throw 'missing callback'
      attrs = attrs = this.attributes
      var errs = {};
      async.series([
        function(done){
          if(!attrs.patSSN)return done(null)
          self.validateSSN({SSN: attrs.patSSN, attr:'patSSN'}, function(err, result){
            if(err){
              errs.patSSN = _invalidSSNStr
              return done(null)
            }
            self._patient = result
            done(null)
          })
        }
        , function(done){
          if(!attrs.subSSN)return done(null)
          self.validateSSN({SSN: attrs.subSSN, attr:'subSSN'}, function(err, result){
            self._subscriber = result
            if(err){
              errs.subSSN = _invalidSSNStr
              return done(null)
            }
            done(null)
          })
        }
        ], function(err){
          if(err)return done(null, errs)
          self._form.trigger('form:valid')
          done(null, errs)
        })
    }
    , _onPatient: function(patient){
      this.set('patFName', patient.FName)
      this.set('patLName', patient.LName)
      this.set('patMiddleI', patient.MiddleI)
      this.set('patSSN', patient.SSN)
      this._patient = patient
    }
    , _onSubscriber: function(patient){
      this.set('subFName', patient.FName)
      this.set('subLName', patient.LName)
      this.set('subMiddleI', patient.MiddleI)
      this.set('subSSN', patient.SSN)
      this._subscriber = patient
    }
    ,defaults: {
        Relationship: 1
      // , InsPlan: 'Center of Toxicology & Environmental Health'
      , subSSN: '111111111'
      , subFName: 'jose'
      , subMiddleI: 'j'
      , subLName: 'oliveros'
      , patSSN: '777777777'
      , patFName: 'test'
      , patMiddleI: 'u'
      , patLName: 'east'
      }
    // , idAttribute: 'PatNum'
    , schema: {
       // InsPlan: {
       //    title: 'Insurance Plan Name'
       //    , url: function(){
       //      return window._host+'/insplan';
       //    }
       //    , type: TextAutoComplete
       //    , validators:[
       //      'required'
       //      ]
       //    , editorClass: 'form-control'
       //    }
         subSSN: {
          title: 'SSN'
          , url: window._host+'/inssub'
          , type: 'Text'
          , validators:[
            'required'
              , {
                type: 'regexp'
                , regexp: /^\d{9}$/
                , message:'Valid SSN required.'
              }
            ]
          , editorClass: 'form-control'
          }
        , subFName: {
          title: 'First Name'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , subMiddleI: {
          title: 'Middle Initial'
          , type: 'Text'
          , editorClass: 'form-control'
        }
        , subLName: {
          title: 'Last Name'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , patSSN: {
          title: 'SSN'
          , url: window._host+'/patplan'
          , type: 'Text'
          , validators:[
            'required'
              , {
                type: 'regexp'
                , regexp: /^\d{9}$/
                , message:'Valid SSN required.'
              }
            ]
          , editorClass: 'form-control'
          }
        , patFName: {
          title: 'First Name'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , patMiddleI: {
          title: 'Middle Initial'
          , type: 'Text'
          , editorClass: 'form-control'
        }
        , patLName: {
          title: 'Last Name'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , Relationship: {
          title: 'Patient relationship to Policy Holder'
          , type: 'Select'
          , options: [
            {
              val: 0
              , label: 'Policy Holder'
            }
            , {
              val: 1
              , label: 'Spouse'
            }
            , {
              val: 2
              , label: 'Child'
            }
            , {
              val: 3
              , label: 'Employee'
            }
            , {
              val: 4
              , label: 'HandicapDep'
            }
            , {
              val: 5
              , label: 'SignifOther'
            }
            , {
              val: 6
              , label: 'InjuredPlaintiff'
            }
            , {
              val: 7
              , label: 'LifePartner'
            }
            , {
              val: 8
              , label: 'Dependent'
            }
            ]
          , editorClass: 'form-control'
        }
        , GroupName: {
          title: 'Group Name'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , GroupNum: {
          title: 'Group Number'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
      }
  });
});

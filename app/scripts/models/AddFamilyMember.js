define([
  'backbone'
  , '_s'
  , 'hbs!tmpl/item/InsuranceInformationForm_tmpl'
  , 'lodash'
  , 'superagent'
  , 'models/FormBase'
  , 'async'
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
  , FormBase
  , async
   ) {
    'use strict';
  /* Return a model class definition */
  return FormBase.extend({
     initialize: function() {
      this.on('save', this._save)
      // this.on('form:rendered', this.renderPatientFields)
      this.on('form:set', this._initForm)
      this.__proto__.__proto__.initialize.apply(this, arguments);
      // this.setQuery('Guarantor', _.random(1000, 9999))
    }
    // , template: _.template(InsuranceInformationForm_tmpl())
    , urlRoot: '/AddFamilyMember'
    , formName: 'Add Family Member'
    , formIsVisible: false
    /**
     * Initialize form events
     * @return {}
     */
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
    , getGuarantor: function(){
      this._guarantor = this.getQuery('Guarantor')
      return this._guarantor
    }
    , _save: function(options, done){
      done = done || _.noop
      if(!_.isFunction(done))throw 'argument should be a callback.'
      //The only data that is to be saved is patplan once all else is validated
      var self = this
      if(!self.getGuarantor())throw 'Guarantor PatNum required.'
      // , _PatientWithPolicyHolderFields =[
      //   'SSN'
      //   , 'FName'
      //   , 'LName'
      //   , 'MiddleI'
      //   , 'Birthdate'
      //   , 'Relationship'
      //   , 'Gender'
      //   , 'Guarantor'
      //   , 'Position'
      // ]
      
      var opts = {
        SSN: this.get('SSN')
        , FName: this.get('FName')
        , MiddleI: this.get('MiddleI')
        , LName: this.get('LName')
        , Birthdate: this.get('Birthdate')
        , Relationship: this.get('Relationship')
        , Gender: this.get('Gender')
        , Guarantor: this.getGuarantor()
        , Position: this.get('Position')
      }

      request
      .post(window._host+'/patient')
      .send(opts)
      .set('Authorization', window.localStorage.getItem('Authorization'))
      .end(function(err, res){
        console.log(res.error);
        if(res.status == 404){
          return done(null, null)
        }
        if(err||res.error)
        return self._errorModal()
        self.addFormToQueue('PatientInfoConfirmation')
        setTimeout(function(){
          self.trigger('save:success')
        }, 300)
      })
    }
    ,defaults: {
      // FName: 'test'
      // , LName: 'user'
      // , MiddleI: 'i'
      // , SSN: _.random(100000000, 999999999)
      // , Birthdate: new Date('03/15/1983')
      // , Relationship: 2
      // , Gender: 0
      // , Guarantor: 0
      // , Position: 0
      }
    // , idAttribute: 'PatNum'
    // _patientWithPolicyHolderFields = [
    //   'SSN'
    //   , 'FName'
    //   , 'MiddleI'
    //   , 'LName'
    //   , 'Birthdate'
    //   , 'Relationship'
    //   , 'Gender'
    //   , 'Guarantor'
    //   , 'Position'
    // ]
    , schema: {
         FName: {
          title: 'First Name'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , LName: {
          title: 'Last Name'
          , type: 'Text'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , SSN: {
          title: 'SSN'
          , type:'Text'
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
        , Birthdate: {
          title: 'Birthdate'
          , type: 'Date'
          , validators:[
            'required'
            ]
          , editorClass: 'form-control'
        }
        , Gender: {
          title: 'Gender'
          , type:'Select'
          , validators:['required']
          , editorClass: 'form-control'
          , options: [
          {
            val: 0
            , label: 'Male'
          }
          , {
            val: 1
            , label: 'Female'
          }
          ]}
        , Position: {
          title: 'Marital Status'
          , type:'Select'
          , validators:['required']
          , editorClass: 'form-control'
          , options: [
          {
            val: 0
            , label: 'Single'
          }
          , {
            val: 1
            , label: 'Married'
          }
          , {
            val: 2
            , label: 'Child'
          }
          , {
            val: 3
            , label: 'Widowed'
          }
          , {
            val: 4
            , label: 'Divorced'
          }
        ]}
        , Email: {
          type:'Text'
          , editorClass: 'form-control'
          , validators:['email', 'required']
          , dataType: 'email'
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
      }
  });
});

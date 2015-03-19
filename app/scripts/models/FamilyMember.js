define([
  'backbone'
  , '_s'
  , 'hbs!tmpl/item/FamilyMemberForm_tmpl'
  , 'lodash'
  , 'superagent'
  , 'bootbox'
  , 'models/InsuranceInformationBase'
  , 'hbs!tmpl/item/PatientInfo_tmpl'
  , 'async'
  , 'bootstrapTemplates'
  , 'backbone.epoxy'
  , 'backbone.auth'
],
function(
  Backbone
  , _s
  , FamilyMemberForm_tmpl
  , _
  , request
  , bootbox
  , InsuranceInformationBase
  , PatientInfo_tmpl
  , async
   ) {
    'use strict';
  var _invalidSSNStr = 'This patient does not exist. Please register this patient before filling out this form.'
  , validateGuarantorErr = 'Invalid'
  , patFields = ['FName', 'LName', 'SSN']
  , guarantorFields = ['gFName', 'gLName', 'gSSN']
  /* Return a model class definition */
  return InsuranceInformationBase.extend({
     initialize: function() {
      this.on('patient', this._onPatient)
      this.on('guarantor', this._onGuarantor)
      this.on('save', this._save)
      this.on('form:rendered', this.renderPatientFields)
      this.on('form:rendered', this.renderGuarantorFields)
      this.on('form:set', this._initForm)
      this.__proto__.__proto__.initialize.apply(this, arguments);
      this.getPatient()
      window._familyForm = this
    }
    , formIsVisible: false
    , _initForm: function(){
      var self = this
      self._form.on('change', self._formChanged.bind(self))
    }
    , _formChanged: function(form){
      form.model.set(form.getValue())
      //check if Relationship changed and hide/show Subscriber Information as needed
      if(form.model.get('Relationship')>0){
        //set current patient as guarantor
        this._subscriber = this._subscriber || this.getGuarantor()
        this.trigger('formlayout:addToQueue', 'InsuranceInformation')
        this._form.trigger('form:valid')
      }
      else{
        this.trigger('formlayout:removeFromQueue', 'InsuranceInformation')
        this.setGuarantor(this._patient)
        this._subscriber = this._patient
        this._form.trigger('form:valid')
      }
      this.renderGuarantorFields()
      this.renderPatientFields()
      // this._form.validate()
    }
    /**
     * Initialize Patient Info if _patient set.
     * @return {[type]} [description]
     */
    , renderPatientFields: function(){
      if(!this._form)throw 'Form not set.'
      if(!this._patient)return
      if(this._patient.PatNum&& !this.get('SSN')){
        this.removeFields(patFields)
        var $pat_fields = this._form.$el.find('#pat_fields')
        $pat_fields.html(PatientInfo_tmpl(this._patient))
        return;
      }
      if(!this.get('SSN'))
      this.restoreFields()
    }
    , renderGuarantorFields: function(){
      this.$household_info = this.$household_info || this._form.$el.find('#household_info')
      if(this.get('Relationship')==0){
        this.removeFields(guarantorFields)
        this.$household_info.hide()
        return;
      }
      this.restoreFields()
      this.$household_info.show()
    }
    , getPatient: function(){
      this._patient =  this.getQuery('Patient')
    }
    , template: _.template(FamilyMemberForm_tmpl())
    , urlRoot: '/familymember'
    , formName: 'Family Form'
    , _save: function(){
        var self = this
        , hasPatPlan = false
        async.series([
          function(done){
           self._saveGuarantor(done)
          }
          , function(done){
            if(self.get('Relationship')==0)return done(-1)
            //save patplan if it exists. Otherwise throw error.
            hasPatPlan = true
            self._savePatPlan(done)
          }
          ], function(err){
          if(err == -1)
          err = null
          if(err){
          self._errorModal(err)
          return self.trigger('save:error', err)
          }
          if(hasPatPlan)
          self.confirmation()
          self.trigger('save:success'
            , {
              Patient: self._patient
              , Relationship: self._form.model.get('Relationship')
            }
          )
        })
    }
    , confirmation: function(){
        Backbone.history.navigate('#!confirmation', {trigger: true})
      }
    /**
     * Look up subscriber. If it doesn't exist throw error. Otherwise use subscriber id to save patplan.
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    , _savePatPlan: function(done){
      var self = this
      async.series([
        function(done){
          self._InsSubExists(done)
        }
        , function(done){
          if(!self._InsSubNum)return done(new Error('Head of household does not have an insurance plan.'))
          self.savePatPlan(done)
        }
        ], done)
    }
    , _saveGuarantor: function(done){
      var self = this
      //save guarantor
      if(!this._patient)
      return self._errorModal('Patient information is not set.'); //error;
      var data = {
        PatNum: this._patient.PatNum
        , Guarantor: this.getGuarantor().PatNum
      }
      request
      .post(window._host+'/familymember')
      .set('Authorization', window.localStorage.getItem('Authorization'))
      .send(data)
      .end(function(err, res){
        if(!res.body.PatNum)
        return self._errorModal(); //error;
        done(null)
      })
    }
    , validate: function(attrs, done) {
      var ssnErr = 'Please enter an SSN of existing patient. Or Register Patient before using this form.'
      , guarantorFieldsErr = 'The information provided does not match our records.'
      , errs = {}
      , self = this
      , done = done||_.noop
      if (this.validateObject(this.getGuarantor(), 'FName', attrs.gFName)&& attrs.gFName)
      errs.gFName = guarantorFieldsErr

      if (this.validateObject(this.getGuarantor(), 'LName', attrs.gLName)&&attrs.gLName)
      errs.gLName = guarantorFieldsErr

      if (this.validateObject(this._patient, 'FName', attrs.FName)&& attrs.FName)
      errs.FName = guarantorFieldsErr

      if (this.validateObject(this._patient, 'LName', attrs.LName)&&attrs.LName)
      errs.LName = guarantorFieldsErr
      async.series([
        function(done){
          if(!attrs.SSN)return done(null)
          self.validateSSN({SSN: attrs.SSN, attr:'SSN'}, function(err, result){
            if(err){
              errs.SSN = _invalidSSNStr
            }
            self._patient = result
            done(null)
          })
        }
        , function(done){
          if(!attrs.gSSN)return done(null)
          self.validateSSN({SSN: attrs.gSSN, attr:'gSSN'}, function(err, result){
            self.setGuarantor(result)
            if(err){
              errs.gSSN = _invalidSSNStr
              return done(null)
            }
            done(null)
          })
        }
        ], function(err){
          if(err)return done(null, errs)
          self._form.trigger('form:valid')
          // console.log(errs);
          done(null, errs)
        })
    }
    , validateSSN: function(options, done){
      var SSN = options.SSN||[]
      if(SSN.length!=9)return new Error('Valid SSN is required.');
      var self = this
       if(!done)return
       request
      .get(window._host+'/patient/ssn/'+options.SSN)
      .set('Authorization', window.localStorage.getItem('Authorization'))
      .end(function(err, res){
        if(!res.error){
        return done(null, res.body)
        }
        self._requestResult(err,res, done)
      })
    }
    , _onPatient: function(patient){
      this.set('FName', patient.FName)
      this.set('LName', patient.LName)
      this.set('MiddleI', patient.MiddleI)
      this.set('SSN', patient.SSN)
      this._patient = patient
    }
    , _onGuarantor: function(patient){
      this.set('gSSN', patient.SSN)
      this.setGuarantor(patient)
      this.setQuery('Guarantor', patient.PatNum )
    }
    ,defaults: {
       Relationship: 2
      }
    // , idAttribute: 'PatNum'
    , schema: {
        FName: {
          title: 'First Name'
          , type:'Text'
          , validators:['required']
          , editorClass: 'form-control'
        }
        , LName: {
            title: 'Last Name'
          , type:'Text', validators:['required']
          , editorClass: 'form-control'}
        , SSN: {
          title: 'SSN'
          , url: window._host+'/patient'
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
        , gFName: {
            title: 'First Name'
            , type:'Text'
            , validators:['required']
            , editorClass: 'form-control'
          }
        , gLName: {
            title: 'Last Name'
            , type:'Text'
            , validators:['required']
            , editorClass: 'form-control'
          }
        , gSSN: {
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

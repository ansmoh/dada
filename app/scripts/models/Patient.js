define([
  'backbone'
  , '_s'
  , 'models/FormBase'
  , 'superagent'
  , 'bootstrapTemplates'
  , 'backbone.epoxy'
  // , 'backbone-schema'
],
function( 
  Backbone
  , _s
  , FormBase
  , request
   ) {
    'use strict';

  /* Return a model class definition */
  return FormBase.extend({
    initialize: function() {
      // this.url = this.urlBase()+this.urlRoot
      // console.log(JSON.stringify(this.defaults));
      this.on('save', this._save)
      this.__proto__.__proto__.initialize.apply(this, arguments);
      window._patientForm = this
      console.log(this.defaults.SSN);
    }
    , urlRoot: '/patient'
    , formName: 'New Patient Registration'
    , formIsVisible: false
    ,defaults: {
      //  FName: 'John'
      // , MiddleI: 'H'
      // , LName: 'Doe'
      // , Gender: 0
      // , Position: 0
      // , Birthdate: new Date('03/15/1983')
      // , SSN: _.random(100000000, 999999999)
      // , Address: '213 Cabrillo Ave.'
      // , City: 'Vallejo'
      // , State: 'CA'
      // , Zip: '94590'
      // , HmPhone: '7076472275'
      // , Email: 'demo@gmail.com'
    }
    , computeds:{
    }
    , idAttribute: 'PatNum'
    , schema: {
        PatNum: {
          type:'Text'
          , editorClass: 'form-control hidden'
        }
        , FName: {
          title: 'First Name'
          , type:'Text'
          , validators:['required']
          , editorClass: 'form-control'
        }
        , MiddleI: {
          title: 'Middle Initial'
          , type:'Text'
          , editorClass: 'form-control'
        }
        , LName: {
          title: 'Last Name'
          , type:'Text'
          , validators:['required']
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
        , Birthdate: {
          title: 'Birthdate'
          , type:'Date'
          , validators:['required']
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
        , Address: {
          type:'Text'
          , validators:['required']
          , editorClass: 'form-control'
        }
        , City: {
          type:'Text'
          , validators:['required']
          , editorClass: 'form-control'
        }
        , State: {
          type:'Select'
          , validators:['required']
          , editorClass: 'form-control'
          , options: [{"val":"AL","label":"Alabama"},{"val":"AK","label":"Alaska"},{"val":"AZ","label":"Arizona"},{"val":"AR","label":"Arkansas"},{"val":"CA","label":"California"},{"val":"CO","label":"Colorado"},{"val":"CT","label":"Connecticut"},{"val":"DE","label":"Delaware"},{"val":"FL","label":"Florida"},{"val":"GA","label":"Georgia"},{"val":"HI","label":"Hawaii"},{"val":"ID","label":"Idaho"},{"val":"IL","label":"Illinois"},{"val":"IN","label":"Indiana"},{"val":"IA","label":"Iowa"},{"val":"KS","label":"Kansas"},{"val":"KY","label":"Kentucky"},{"val":"LA","label":"Louisiana"},{"val":"ME","label":"Maine"},{"val":"MD","label":"Maryland"},{"val":"MA","label":"Massachusetts"},{"val":"MI","label":"Michigan"},{"val":"MN","label":"Minnesota"},{"val":"MS","label":"Mississippi"},{"val":"MO","label":"Missouri"},{"val":"MT","label":"Montana"},{"val":"NE","label":"Nebraska"},{"val":"NV","label":"Nevada"},{"val":"NH","label":"New Hampshire"},{"val":"NJ","label":"New Jersey"},{"val":"NM","label":"New Mexico"},{"val":"NY","label":"New York"},{"val":"NC","label":"North Carolina"},{"val":"ND","label":"North Dakota"},{"val":"OH","label":"Ohio"},{"val":"OK","label":"Oklahoma"},{"val":"OR","label":"Oregon"},{"val":"PA","label":"Pennsylvania"},{"val":"RI","label":"Rhode Island"},{"val":"SC","label":"South Carolina"},{"val":"SD","label":"South Dakota"},{"val":"TN","label":"Tennessee"},{"val":"TX","label":"Texas"},{"val":"UT","label":"Utah"},{"val":"VT","label":"Vermont"},{"val":"VA","label":"Virginia"},{"val":"WA","label":"Washington"},{"val":"WV","label":"West Virginia"},{"val":"WI","label":"Wisconsin"},{"val":"WY","label":"Wyoming"},{"val":"AS","label":"American Samoa"},{"val":"DC","label":"District of Columbia"},{"val":"FM","label":"Federated States of Micronesia"},{"val":"GU","label":"Guam"},{"val":"MP","label":"Northern Mariana Islands"},{"val":"PR","label":"Puerto Rico"},{"val":"VI","label":"Virgin Islands"}]}
        , Zip: {
          type:'Text'
          , validators:['required'
          , {
            type: 'regexp'
            , regexp: /^\d{5}$/
            , message:'Valid Zip Code Required.'
          }
          ]
          , editorClass: 'form-control'
        }
        , HmPhone: {
          title: 'Home Phone'
          , type:'Text'
          , validators:[
          'required'
          , {
            type: 'regexp'
            , regexp: /^\d{10}$/
            , message:'Valid phone number required.'
          }
          ]
          , editorClass: 'form-control'
        }
        , WkPhone: {
          title: 'Work Phone'
          , type:'Text'
          , editorClass: 'form-control'
        }
        , WirelessPhone: {
          title: 'Cell Phone'
          , type:'Text'
          , editorClass: 'form-control'
        }
        , Email: {
          type:'Text'
          , editorClass: 'form-control'
          , validators:['email', 'required']
          , dataType: 'email'
        }
      }
      /**
       * Custom Save function.
       * @return {}
       */
    , _save: function(){
      var self = this
      var PatNum = this.get('PatNum')
      if(PatNum||PatNum!='')
      PatNum = parseInt(PatNum)
      if(PatNum)
      return this._put()
      this._post()
    }
    /**
     * Post to server
     * @return {[type]}
     */
    , _post: function(){
      var self = this
      , data = this.toJSON()
      delete data.PatNum
      request
      .post(window._host+'/patient')
      .set('Authorization', window.localStorage.getItem('Authorization'))
      .send(data)
      .end(function(err, res){
        if(err||res.error){
          self.trigger('save:error')
        }
        if(!res.body.PatNum)
        return self._errorModal(); //error;
        self._saveSuccess(res.body)
      })
    }
    , _put: function(){
      var Patient = this.toJSON()
      , self = this
      delete Patient.PatNum
      request
      .put(window._host+'/patient')
      .set('Authorization', window.localStorage.getItem('Authorization'))
      .send(Patient)
      .end(function(err, res){
        if(err||res.error){
          self.trigger('save:error')
        }
        if(!res.body.PatNum)
        return self._errorModal(); //error;
        self._saveSuccess(res.body)
      }) 
    }
    , _saveSuccess: function(Patient){
      this.set('PatNum', Patient.PatNum)
      this.trigger('save:success', {Patient: this.toJSON()})
    }
    });
});

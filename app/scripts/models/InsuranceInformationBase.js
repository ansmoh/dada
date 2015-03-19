define([
  'backbone'
  , '_s'
  , 'lodash'
  , 'mixin/Query'
  , 'models/FormBase'
  , 'superagent'
  , 'async'
  , 'bootstrapTemplates'
  , 'backbone.epoxy'
  , 'backbone.auth'
],
function( 
  Backbone
  , _s
  , _
  , query
  , FormBase
  , request
  , async
   ) {
    'use strict';
  /* Return a model class definition */
    var defaultRelationshipValue = 2
    return FormBase.extend({
     initialize: function() {
      this.urlRoot = this.urlBase()+this.urlRoot
      _.extend(this, query)
      this.getPatient()
      this.getRelationship()
      window._currentForm = this
    }
    /**
     * get Relationship to head of household that may be stored in the query string.
     * @return {} empty
     */
    , getRelationship: function(){
      this._relationship =  this.getQuery('Relationship') || defaultRelationshipValue
      if(this.attributes.Relationship)
      this.set('Relationship', defaultRelationshipValue)
      this.set('Relationship', this._relationship)
    }
    /**
     * get Patient Info that may be stored on the query string.
     * @return empty
     */
    , getPatient: function(){
      this._patient =  this.getQuery('Patient')
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
    , _saveInsFromGroupNameNumber: function(options, done){
      done = done || _.noop
          if(!_.isFunction(done))throw 'argument should be a callback.'
        //The only data that is to be saved is patplan once all else is validated
        var self = this
        if(!self._subscriber)throw '_subscriber required.'
        var opts = {
          GroupName: this.get('GroupName')
          , GroupNum: this.get('GroupNum')
          , Relationship: this.get('Relationship')
          , Subscriber: this._subscriber.PatNum
          , SubscriberID: this._subscriber.SSN
          , PatNum: this._patient.PatNum
        }
        // return console.log(opts)

        request
        .post(window._host+'/patplan/fromgroup')
        .send(opts)
        .set('Authorization', window.localStorage.getItem('Authorization'))
        .end(function(err, res){
          if(res.status == 404){
            return done(null, null)
          }
          if(err|res.error)
          return self._errorModal()
          self.trigger('save:success')
        })   
    }
    , _saveInsInfo: function(){
      var self = this
      async.waterfall([
        function(done){
          self._InsSubExists(done)
        }
        , function(exists, done){
          if(self.get('Relationship')==0)return done(null, exists)
          if(!this._guarantor)throw '_guarantor is not set.'
          done(null, exists)
        }
        , function(exists, done){
          if(exists&&self.get('Relationship')!=0)
          return self.savePatPlan.call(self, done)
          if(!exists&&self.get('Relationship')==0)
          return self._saveInsSubPatPlan.call(self, done)
          done(null)
        }
        ], function(err){
          if(err)
          return self._errorModal()
          self.trigger('save:success')
      })
    }
    /**
     * Save both InsSub and PatPlan to server.
     * @param optional callback
     * @return
     */
    , _saveInsSubPatPlan: function(done){
      var self = this
      done = done || _.noop
      if(!_.isFunction(done))throw 'argument should be a callback.'
      async.series([
        function(done){
          self.saveInsSub(done)
        }
        , function(done){
          self.savePatPlan(done)
        }
        ], done)
    }
    /**
     * Save InsSub to server.
     * @param  Optional callback
     */
    , saveInsSub: function(done){
        done = done || _.noop
        if(!_.isFunction(done))throw 'argument should be a callback.'
        //The only data that is to be saved is patplan once all else is validated      
        var self = this
        , data
        if(!this._subscriber)
        return self._errorModal(); //error;
        data = {
          PlanNum: self._getPlanNum()||0
          , Subscriber: self._subscriber.PatNum
          , DateEffective: new Date('01/01/01')
          , DateTerm: new Date('01/01/01')
          , ReleaseInfo: 1
          , AssignBen: 1
          , SubscriberID: self._subscriber.SSN
          , BenefitNotes: ''
          , SubscNote: ''
        }
        request
        .post(window._host+'/inssub')
        .set('Authorization', window.localStorage.getItem('Authorization'))
        .send(data)
        .end(function(err, res){
          if(!res.body.error){
            self._InsSubNum = res.body
            return done(null, res.body)
          }
          self._requestResult(err,res, done)
        }) 
    }
    /**
     * Get InsSub from server.
     * @param  Optional callback
     */
    , _InsSubExists: function(done){
        done = done || _.noop
        if(!_.isFunction(done))throw 'argument should be a callback.'
        //The only data that is to be saved is patplan once all else is validated
        var self = this
        if(!self._subscriber)throw '_subscriber required.'
        request
        .get(window._host+'/inssub/'+this._subscriber.PatNum)
        .set('Authorization', window.localStorage.getItem('Authorization'))
        .end(function(err, res){
          if(res.status == 404){
            return done(null, null)
          }
          if(res.error)
          return self._requestResult(err,res, done)
          if(res.body.InsSubNum){
            self._InsSubNum = res.body.InsSubNum
            return done(null, res.body.InsSubNum)
          }
          done(null, null)
        }) 
    }
    /**
     * Save PatPlan obj to server.
     * @param  optional callback
     * @return 
     */
    , savePatPlan: function(done){
        done = done || _.noop
        if(!_.isFunction(done))throw 'argument should be a callback.'
        //The only data that is to be saved is patplan once all else is validated      
        var self = this
        , data
        if(!this._patient)
        return self._errorModal(); //error;
        if(!this._InsSubNum)throw 'missing InsSubNum';
        data = {
          PatNum: this._patient.PatNum
          , Relationship: parseInt(this.get('Relationship'))
          , InsSubNum: this._InsSubNum
          , Ordinal: 1
          , IsPending: 0
          , PatID: '' 
        }
        request
        .post(window._host+'/patplan')
        .set('Authorization', window.localStorage.getItem('Authorization'))
        .send(data)
        .end(function(err, res){
          if(!res.error){
          return done(null, res.body)
          }
          self._requestResult(err,res, done)
        }) 
    }
    /**
     * Get PlanNum from InsPlanName editor
     * @return {number}
     */
    , _getPlanNum: function(){
      var input = this._getInsPlanEditorInput()
      return input.attr('data-plannum')
    }
    /**
     * Set PlanNum from InsPlanName editor
     * @return {null}
     */
    , _setPlanNum: function(PlanNum){
      var input = this._getInsPlanEditorInput()
      input.attr('data-plannum', PlanNum)
      return input.attr('data-plannum')
    }
    /**
     * Get input for InsPlan editor
     * @return {jquery input}
     */
    , _getInsPlanEditorInput: function(){
      this.$InsPlanEditorInput = this.$InsPlanEditorInput || this._form.fields.InsPlan.$el.find('input')
      return this.$InsPlanEditorInput
    }
    , setGuarantor: function(obj){
      this._guarantor = obj
      this.setQuery('Guarantor', obj.PatNum)
      return this._guarantor
    }
    , getGuarantor: function(){
      return this._guarantor
    }
  });
});

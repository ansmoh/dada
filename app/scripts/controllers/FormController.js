define([
    'backbone'
    ,'commands'
    ,'reqres'
    ,'qs'
    ,'_s'
    ,'vent'
    ,'lodash'
    , 'models/Patient'
    , 'models/FamilyMember'
    , 'models/InsuranceInformation'
    , 'models/PatientInfoConfirmation'
    , 'models/AddFamilyMember'
  ],
  function(
    Backbone
    , commands
    , reqres
    , qs
    , _s
    , vent
    , _s
    , mdlPatient
    , mdlFamilyMember
    , mdlInsuranceInfo
    , mdlPatientInfoConfirmation
    , mdlAddFamilyMember
    ) {

    return Backbone.Marionette.Controller.extend({

      initialize: function(options) {
        var self = this
        this._forms=[]
        this._forms.push(mdlPatient)
        this._forms.push(mdlFamilyMember)
        this._forms.push(mdlInsuranceInfo)
        this._forms.push(mdlPatientInfoConfirmation)
        this._forms.push(mdlAddFamilyMember)
        reqres.setHandler('forms', self.forms.bind(self))
      }
      , forms: function(){
        return this._forms
      }
    });

  });

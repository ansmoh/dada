define([
    'backbone'
    ,'hbs!tmpl/layout/FormLayout_tmpl'
    ,'reqres'
    ,'regionManager'
    , 'mixin/Query'
    , 'lodash'
    , 'vent'
    , 'superagent'
    , 'commands'
    , 'qs'
    , '_s'
    , 'backbone-forms'
],
  function (
    Backbone
    , FormLayout_tmpl
    , reqres
    , regionManager
    , query
    , _
    , vent
    , request
    , commands
    , qs
    , _s
    ) {
      'use strict';
     var _validate_callback = function(err, result){
      console.log(result);
      result = result ||{}
      //enable save button
      if(_.keys(result).length>0)return this._disableSave()
      this._enableSave()
      }
    /* Return a Layout class definition */
    return Backbone.Marionette.Layout.extend({

      initialize: function(options) {
        var self = this
        this.options = options || {}
        _.extend(this, query)
        this.on('formlayout:removeFromQueue', this.removeFormFromQueue.bind(this))
        this.on('formlayout:addFormToQueue', this.addFormToQueue.bind(this))
        this.on('formlayout:nextform', this._closeOrNext.bind(this))
        this._regionManager = reqres.request('app:regionmanager')
        this._forms = reqres.request('forms')
        window._formLayout = this
        //is formseries?
        this.formSeries()
        if(this.isFormSeries())return;
        this.formFromModel()
      }
      , removeFormFromQueue: function(formName){
        var forms = _.remove(this.getQueuedForms()
        , function(f){
          return f == formName
        })
        this.setQueuedForms(forms)
        this._formSeries.completedForms.push(formName)
        //set query
        this.setQuery('forms', this._formSeries.forms)
        this.setQuery('completedForms', this._formSeries.completedForms)
        this.formSeries()
        this.render()
      }
      , getQueuedForms: function(){
        this._formSeries.forms=this.getQuery('forms')
        return this._formSeries.forms
      }
      , setQueuedForms: function(Forms){
        this._formSeries.forms=Forms
      }
      , addFormToQueue: function(formName){
        var forms  = this.getQueuedForms()
        forms.push(formName)
        this.setQueuedForms(forms)
        //set query
        this.setQuery('forms', this._formSeries.forms)
        this.setQuery('completedForms', this._formSeries.completedForms)
        // this.formSeries()
        this.render()

      }
      , isFormSeries: function(){
        this._formSeries = this._formSeries||{}
        return this._formSeries.forms
      }
      , formSeries: function(){
        var query = Backbone.history.fragment
        if(query.indexOf('?')==-1)return;
        query = query.split('?')[1]
        this._formSeries = qs.parse(query)
        this._formSeries.forms = this._formSeries.forms||[]
        if(_.isString(this._formSeries.forms)){
        this._formSeries.forms = []
        this._formSeries.forms.push(this._formSeries.forms)
        }
        if(this._formSeries.forms.length==0)
        this.confirmation()
        if(!_.isArray(this._formSeries.forms))throw 'should be array of form keys'
        this._formSeries.completedForms = this._formSeries.completedForms||[]
        //load first form
        this.formClassByName(_.first(this._formSeries.forms))
      }
      , home: function(){
        throw 'home...'
        Backbone.history.navigate('', {trigger: true})
      }
      , confirmation: function(){
        Backbone.history.navigate('#!confirmation', {trigger: true})
      }
      , ProgressBar: function(){
        if(!this.isFormSeries())return;
        this.$el.find('#progress_container').removeClass('hidden')
        this.$progressBar = this.$el.find('.progress-bar')
        var l = this._formSeries.completedForms.length
        this._percent = l/(this._formSeries.forms.length+this._formSeries.completedForms.length)*100
        this.$progressText = this.$el.find('#progress_text')
        this.$progressText.html(_s.sprintf('%s of %s forms remaining', this._formSeries.forms.length, this._formSeries.completedForms.length+this._formSeries.forms.length))
        //set width
        this.$progressBar.css('width', this._percent+'%')
        this.$progressBar.attr('aria-valuenow', this._percent)
      }
      , formClassByName: function(Name){
        var self = this
         this._form = _.find(this._forms, function(form){
          return form.prototype.urlRoot == '/'+Name
        })
        this.initForm()
      }
      , formClassFromUrl: function(){
        var self = this
         this._form = _.find(this._forms, function(form){
          var formUrl = ''
          formUrl = form.prototype.__proto__.urlBase()+form.prototype.urlRoot
          return formUrl == window._host+'/'+self.options.formUrl
        })
      }
      , formFromModel: function(){
        var self = this
        this.formClassFromUrl()
        this.initForm()
      }
      , initForm: function(){
        var self = this
        if(!self._form)
        return;
        // return this.home()
        var f = {
          model : new self._form({formLayout: self})
        }
        if(this._form.prototype.template)
        f.template = this._form.prototype.template
        this.$form = new Backbone.Form(f)
        this.$form.on('form:valid', this._enableSave.bind(this))
        f.model._form = this.$form
        f.model.trigger('form:set')
        f.model.on('change', self._updateForm.bind(this))
        f.model.on('save:success', self._formData.bind(this))
        f.model.on('save:success', self._closeOrNext.bind(this))
      }

      /**
       * Receive data from forms on save
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      , _formData: function(data){
        if(!data)return;
        //check if this is a series of forms.
        if(!this.isFormSeries())
        return;
        var self = this
        _.keys(data)
        .forEach(function(k){
          self.setQuery(k, data[k])
        })
      }
      , _nextForm: function(){
        this._formSeries.forms = this.getQueuedForms()
        var forms = this._formSeries.forms||[]
        if(forms.length==0){
          this.confirmation()
        }
        var form = _.first(this._formSeries.forms)
        //clear from list
        this._formSeries.forms = _.remove(this._formSeries.forms
        , function(f){
          return f != form
        })
        this._formSeries.completedForms.push(form)
        //set query
        this.setQuery('forms', this._formSeries.forms)
        this.setQuery('completedForms', this._formSeries.completedForms)
        this.formSeries()
        this.render()
      }
      , setSubmitButtonText: function(text){
        this.$form_layout_submit = this.$el.find('#form_layout_submit')
        this.$form_layout_submit.html(text)
      }
      , _closeOrNext: function(){
        this._disableSave()
        this._nextForm()
        // if(this.isFormSeries())
        // return this._nextForm()
        // this.confirmation()
      }
      , _updateForm: function(model){
        var self = this
        , keys = _.keys(self.$form.fields)
        keys.forEach(function(k){
          if(model.attributes[k]==self.$form.getValue(k))return;
          var val = {}
          val[k] = model.attributes[k]
          self.$form.setValue(val)
        })
        self.$form.validate({callback: _validate_callback.bind(self)})
      }
      , _renderForm: function(){
        if(!this.$form)return;
        this.$formEl = this.$form.render()
        this.$form.model.trigger('form:rendered', this.$formEl)
        this.$formRegion.html('')
        this.$formRegion.append(this.$formEl.el)
      }
      , template: FormLayout_tmpl,

      /* Layout sub regions */
      regions: {
          form_content: '#form_content'
      },  

      /* ui selector cache */
      ui: {},

      /* Ui events hash */
      events: {
        'keyup form':'_validate'
        , 'click #form_layout_submit': '_submit'
      }

      , _submit: function(){
        this.$form_layout_submit.addClass('disabled')
        this.$form.model.set(this.$form.getValue())
        this.$form.model.trigger('save')
      }
      , _validate: function(e){
        var self = this
        this.$form.validate({
          callback: self.validate_callback.bind(self)
        })
      }
      , validate_callback: _validate_callback
      , _disableSave: function(){
        this.$form_layout_submit.addClass('disabled')
      }
      , _enableSave: function(){
        this.$form_layout_submit.removeClass('disabled')
      }
      /* on render callback */
      , onRender: function() {
          var self = this
          this.ProgressBar()
          this.$formRegion = this.$el.find('#form_content')
          this.$formTitle = this.$el.find('#form-title')
          this.$form_layout_submit = this.$el.find('#form_layout_submit')
          if(!this._form) return;
          this.$formTitle.html(this._form.prototype.formName)
          this._renderForm()
          if(this.getQueuedForms().length==1)
          this.setSubmitButtonText('Finish')
          this.$form_layout_submit.removeClass('disabled')
      }
    });

  });
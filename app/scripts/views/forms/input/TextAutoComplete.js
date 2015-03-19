define([
  'backbone'
  , 'superagent'
  , 'bootstrap3-typeahead'
],
function( 
  Backbone
  , request
    ) {
    'use strict';

  return Backbone.Form.editors.Text.extend({
  	initialize: function(options) {
			this.schema = options.schema
      // Call parent constructor
      Backbone.Form.editors.Text.prototype.initialize.call(this, options);
    }
    , tagName: 'input'
    , _keyUp: function(){

    }
    , render: function(){
      var self = this
      , $el = $(this.el)
      $el.typeahead({
        displayKey: 'GroupName'
        , displayText: function(item){
          return item.GroupName||''
        }
        , updater: function (item) {
          $el.attr('data-plannum', item.PlanNum)
          return item.GroupName;
        }
        , source: function(query, done){
          var url
          if(_.isFunction(self.schema.url))
          url = self.schema.url()
          else
          url = self.schema.url
          request
          .get(url)
          .query({
            query: query
            , limit: 20
          })
          .set('Authorization', window.localStorage.getItem('Authorization'))
          .end(function(err, res){
            if(res.error)return done(res.error)
            res.body = _.map(res.body)
            done(res.body)
          })
        }
      })
       return Backbone.Form.editors.Text.prototype.render.call(this);
    }
  });
});

define(['backbone','qs', 'reqres', 'lodash'],function(Backbone, qs, reqres, _){
  return {
    setQuery:function(name, value){
      var fragment = Backbone.history.fragment
      fragment = fragment.split('?')
      var query = qs.parse(fragment[1])
      fragment = fragment[0]
      query[name] = value
      var hasEx = /^.*\!/.test(fragment)
      if(!/^.*\!/.test(fragment))
      fragment = fragment +'!'
      fragment = fragment + '?'+ qs.stringify(query)
      Backbone.history.navigate(fragment, {trigger:false})
    }
    , getQueryArray:function(name){
      name = this.getQuery(name)
      if(_.isArray(name))return name
      var r = []
      r.push(name)
      return r
    }
    , getQuery:function(name){
      var fragment = Backbone.history.fragment
      if(!fragment)
        fragment = window.location.hash
      fragment = _.last(fragment.split('?'))
      var query = qs.parse(fragment)
      query = query[name]
      return query
    }
    , delQuery: function(name){
      var fragment = Backbone.history.fragment
      fragment = fragment.split('?')
      var query = qs.parse(fragment[1])
      fragment= fragment[0]
      if(!query[name])return
      delete query[name]
      fragment = fragment +'?'+qs.stringify(query)
      Backbone.history.navigate(fragment, {trigger:false})
    }
    , clearQuery: function(){
      var fragment = Backbone.history.fragment
      fragment = fragment.split('?')
      fragment= fragment[0]
      Backbone.history.navigate(fragment, {trigger:false}) 
    } 
  }
})
define(['backbone.wreqr'],function(Wreqr){
  var reqres=new Backbone.Wreqr.RequestResponse()
  _.extend(reqres, {
    request: function(handler){
      if(!_.has(this._wreqrHandlers, handler))return null
      return Backbone.Wreqr.RequestResponse.prototype.request.apply(this, arguments)
    }
  })
  return reqres
})
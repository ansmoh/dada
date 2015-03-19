define(function(){
  return {
    _getOption: function(option){
      this.options = this.options ||{}
      return this.options[option]
    }
  }
})
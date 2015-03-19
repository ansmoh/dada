define([
	'handlebars'
	, '_s'
	], function(
		handlebars
		, _
		){
	 var phoneReg = /^(\d{3})(\d{3})(\d{4})/
	 function Phone( context, options ) {
	 		if(_.isNumber(context))
	 		context = context.toString()
		 	if(_.isString(context)){
		 		context = context.match(phoneReg)
		 		context = _.sprintf('(%s)%s-%s', context[1], context[2], context[3])
		 		return context
		 	}
	  }
  handlebars.registerHelper('Phone', Phone );
  return Phone;
})
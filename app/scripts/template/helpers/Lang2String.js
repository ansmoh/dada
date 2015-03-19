define(['handlebars', '_s'], function(handlebars, _){
		 function Lang2String( context, options ) {
		 	var s=context
		 	var _s=[]
		 	_.each(s, function(l){
		 		_s.push(l.id)
		 	})
		 	s=_.join(',', _s)
		 	// console.log(s);
		    return s
		  }
	  handlebars.registerHelper('Lang2String', Lang2String );
	  return Lang2String;
})
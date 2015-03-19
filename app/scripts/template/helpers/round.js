define(['handlebars', '_s'], function(handlebars, _){
		 function round( context, options ) {
		 	if(context){
		 		var f=parseFloat(context)
		 		f=Math.floor(f)
			    return f
		 	}
		 	else return parseFloat(0.00)
		  }
	  handlebars.registerHelper('round', round );
	  return round;
})
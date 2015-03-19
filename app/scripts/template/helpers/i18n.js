define(['handlebars', '_s', 'i18n/main'], function(handlebars, _, i18next){
		 function i18n( context, options ) {
		 	return (i18next != undefined ? i18next.t(context) : context);
		  }
	  handlebars.registerHelper('i18n', i18n );
	  return i18n;
})
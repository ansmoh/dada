define(['handlebars', '_s', 'moment'], function(handlebars, _, moment){
     function date( context, options ) {
      if(!context)return 'no date'
      if(typeof context == 'object'){
        return context
      }
      else return moment(new Date(context)).format('MMMM Do YYYY, h:mm a')
      }
    handlebars.registerHelper('date', date );
    return date;
})
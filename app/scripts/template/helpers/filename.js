define(['handlebars', '_s'], function(handlebars, _) {
  var reg = /(.+)\.(.{1,5})$/
  function filename(context, options) {
    if(!_.isString(context)) return;
    context = context.match(reg)
    if(context.length<2)return console.log(context);
    // console.log(context)
    context = _.sprintf('%s.%s', _(context[1]).prune(15), context[2])
    return context
  }
  handlebars.registerHelper('filename', filename);
  return filename;
})
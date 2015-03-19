define(['handlebars', '_s'], function(handlebars, _) {
  function fullname(context, options) {
    if (!context) return
    if (!_.has(context, 'firstname') | !_.has(context, 'lastname')) return
    return _(_.sprintf('%s %s', context.firstname, context.lastname)).prune(20)
  }
  handlebars.registerHelper('fullname', fullname);
  return fullname;
})
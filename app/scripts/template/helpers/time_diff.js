define(['handlebars', '_s', 'mixins/TimeDiffGenerator'], function(handlebars, _, TimeDiffGenerator) {
  function time_diff(context, options) {
    if (typeof context == 'string') context = parseFloat(context)
    context = TimeDiffGenerator.generateTimeDiffString(context)
    return '+ '+context
  }
  handlebars.registerHelper('time_diff', time_diff);
  return time_diff;
})
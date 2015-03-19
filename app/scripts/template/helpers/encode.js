define(['handlebars', '_s'], function(handlebars, _) {
  function encode(context, options) {
    return escape(context)
  }
  handlebars.registerHelper('encode', encode);
  return encode;
})
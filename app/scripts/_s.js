
define(['underscore',
    'underscore.string'
],function(_, _s) {
    // Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
    _.str= _s;

    // Mix in non-conflict functions to Underscore namespace if you want
    _.mixin(_.str.exports());

    // All functions, include conflict, will be available through _.str object
    _.str.include('Underscore.string',
        'string'); // => true
    return _
})

define(['handlebars',
    '_s',
    'BootstrapFormHelpers_languages_codes'
],function(handlebars, _) {
    function LangCode2Country(context, options) {
        var s= _(context).words('_')
        s=s[1]
        return s
    }
    handlebars.registerHelper('LangCode2Country',
        LangCode2Country);
    return LangCode2Country;
})

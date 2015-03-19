define(['handlebars',
    '_s',
    'BootstrapFormHelpers_languages_codes'
],function(handlebars, _) {
    function LangCode2Name(context, options) {
        var s= _(context).words('_')
        var code=s[0]
        s=BFHLanguagesList[code]
        s=_(s).capitalize()	
        return s
    }
    handlebars.registerHelper('LangCode2Name',
        LangCode2Name);
    return LangCode2Name;
})

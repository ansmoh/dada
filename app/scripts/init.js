require.config({

    baseUrl: "/scripts",

    /* starting point for application */
    deps: [
    , 'jquery'
    , 'backbone'
    , 'backbone.auth'
    , 'backbone.marionette'
    , 'bootstrap'
    , 'main'
    , 'backbone-forms'
    , 'modernizr'
    , 'moment'
    , 'bootstrap-datepicker'
    , 'date-utils'
    , 'touche'
    , 'text'
    ],


    shim: {
        'jquery':{
            exports:'jquery'
        }
        ,backbone: {
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        qs:{
            exports:'qs'
        },
        ms:{
            exports:'ms'
        },
        'backbone.localstorage':{
            exports:'backbone.localstorage'
        },
        'backbone-forms':{
            deps:['backbone']
        }
        ,'bootstrap-datepicker':{
            deps:['jquery']
        }
        , 'touche':{
            deps:['jquery']
        }
        , 'backbone.epoxy':{
            deps:['jquery', 'backbone']
        }
        , 'bootstrap3-typeahead':{
            deps: ['jquery', 'bootstrap']
        }
        , bootbox:{
            deps:['bootstrap', 'jquery']
        }
        , 'backbone-schema':{
            deps:['backbone']
        }
        , 'jquery-backstretch':{
            deps:['jquery']
        }
        , 'backbone.auth':{
            deps: ['backbone']
        }
    },

    paths: {
        'backbone.auth':'../bower_components/backbone.auth/index',
        'jquery-backstretch':'../bower_components/jquery-backstretch/jquery.backstretch',
        'backbone-schema':'../bower_components/backbone-schema/backbone-schema',
        'bootbox':'../bower_components/bootbox/bootbox',
        'bootstrap3-typeahead':'../bower_components/bootstrap3-typeahead/bootstrap3-typeahead',
        'backbone.epoxy':'../bower_components/backbone.epoxy/backbone.epoxy',
        'bootstrapTemplates':'../bower_components/backbone-forms/distribution.amd/templates/bootstrap3',
        'uuid': '../bower_components/uuid-js/lib/uuid',
        touche: '../bower_components/touche/src/touche',
        accounting: '../bower_components/accounting/accounting',
        'backbone-forms': '../bower_components/backbone-forms/distribution.amd/backbone-forms',
        moment: '../bower_components/moment/moment',
        lodash: '../bower_components/lodash/dist/lodash',
        ms: '../bower_components/ms/index',
        qs: '../bower_components/qs-amd/index',
        superagent: '../bower_components/superagent/superagent',
        async: '../bower_components/async/lib/async',
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore-amd/underscore',
        'underscore.string': '../bower_components/underscore.string/lib/underscore.string',
        'backbone.localstorage': '../bower_components/backbone.localstorage/backbone.localStorage',
        /* alias all marionette libs */
        'backbone.marionette': '../bower_components/backbone.marionette/lib/core/backbone.marionette',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'modernizr': '../bower_components/modernizr/modernizr',
        // 'stripe': 'https://checkout.stripe.com/checkout',

        /* alias the bootstrap js lib */
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        'bootstrap-datepicker': '../bower_components/bootstrap-datepicker/js/bootstrap-datepicker',
        'date-utils': '../bower_components/date-utils/lib/date-utils',


        /* Alias text.js for template loading and shortcut the templates dir to tmpl */
        text: '../bower_components/requirejs-text/text',
        tmpl: "../templates",

        /* handlebars from the require handlerbars plugin below */
        handlebars: '../bower_components/require-handlebars-plugin/Handlebars',

        /* require handlebars plugin - Alex Sexton */
        i18nprecompile: '../bower_components/require-handlebars-plugin/hbs/i18nprecompile',
        json2: '../bower_components/require-handlebars-plugin/hbs/json2',
        hbs: '../bower_components/require-handlebars-plugin/hbs'
    },

    hbs: {
        disableI18n: true
    }
    ,config: {
        'GA': {
            'id' : 'UA-50279309-1'
        }
    }
});

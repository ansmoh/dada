require.config({
    baseUrl: '../app/scripts',
    urlArgs: 'cb=' + Math.random(),

    deps: [
    'backbone'
    , 'backbone.auth'
    , 'backbone.marionette'
    , 'backbone-forms'
    ],
    shim: {
        backbone: {
            deps:['underscore'],
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
        , 'backbone.auth':{
            deps: ['backbone']
        }
    },
    paths: {
        spec: '../../test/spec',
        test_user: '../../test/TestUser',
        'backbone-forms': '../bower_components/backbone-forms/distribution/backbone-forms',
        moment: '../bower_components/moment/moment',
        datejs: '../bower_components/datejs/build/core',
        'jquery.cookie':'../bower_components/jquery.cookie/jquery.cookie',
        lodash: '../bower_components/lodash/dist/lodash',
        ms: '../bower_components/ms/index',
        qs: '../bower_components/qs-amd/index',
        superagent: '../bower_components/superagent/superagent',
        async: '../bower_components/async/lib/async',
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        'backbone.auth': '../bower_components/backbone.auth/index',
        underscore: '../bower_components/underscore-amd/underscore',
        'underscore.string': '../bower_components/underscore.string/lib/underscore.string',
        'backbone.localstorage': '../bower_components/backbone.localstorage/backbone.localStorage',
        /* alias all marionette libs */
        'backbone.marionette': '../bower_components/backbone.marionette/lib/core/backbone.marionette',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'bootstrap3-typeahead':'../bower_components/bootstrap3-typeahead/bootstrap3-typeahead',
        'bootstrap-3-timepicker':'../bower_components/bootstrap-3-timepicker/js/bootstrap-timepicker',
        '_async': '../bower_components/requirejs-plugins/src/async',
        'uuid':'../bower_components/uuid/uuid',
        'date-utils': '../bower_components/date-utils/lib/date-utils',
        
        /* alias the bootstrap js lib */
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',


        /* Alias text.js for template loading and shortcut the templates dir to tmpl */
        text: '../bower_components/requirejs-text/text',
        tmpl: "../templates",

        'jqueryui': '../bower_components/jquery-ui-draggable/jquery-ui-draggable',

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
});

/* require test suite */
require([
    'jquery',
    'spec/testSuite'
],
function( $, testSuite ) {

    'use strict';

    /* on dom ready require all specs and run */
    $( function() {
        require(testSuite.specs, function() {

            if (window.mochaPhantomJS) {
                mochaPhantomJS.run();
            }
            else {
                mocha.run();
            }
            
        });
    });
});
  

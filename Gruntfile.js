'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet
, tokens = require('server.test.accesstokens')
, express = require('express')
, async = require('async')
, fs = require('fs')
, cheerio = require('cheerio')
, _ = require('lodash')
, s = require('underscore.string')
, snoop = require('snoop')
, _proxyPath = 'forms'
, _dev_server = 'root:dev.ddsapps.com:/var/www/forms/public_html'
, _production_server = 'root:ddsapps.com:/var/www/forms/public_html'
, mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'
function deployRequiredArgs(args){
  if(_.keys(args).length<3) throw 'missing arguments.'
}
module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(function(dep){
      if(dep=="grunt-cli")return
      grunt.loadNpmTasks(dep) 
  });
  // show elapsed time at the end
  require('time-grunt')(grunt);

  // configurable paths
  var yeomanConfig = {
      app: 'app',
      dist: 'www'
  };
  //custom task for compiling index.html for production
  function genProxyPath(proxyPath, url){
      return proxyPath + '/' + url
  }
  grunt.registerTask('index', 'Modify index.html paths for proxy.', function(proxyPath) {
    var fileName = './www/index.html'
    if(!proxyPath)throw new Error('Proxy path is required.')
    // Force task into async mode and grab a handle to the "done" function.
    var done = this.async();
    async.waterfall([
      function(done){
          fs.readFile(fileName, {encoding: 'utf8'}, done) 
      }
      , function(html, done){
          var $ = cheerio.load(html)
          //links
          $('link').each(function(l){
              l = $(this)
              l.attr('href', genProxyPath(proxyPath, l.attr('href')))
          })
          $('script').each(function(l){
              l = $(this)
              l.attr('src', genProxyPath(proxyPath, l.attr('src')))
          })
          done(null, $.html())
      }
      , function(html, done){
          fs.writeFile(fileName, html, {encoding: 'utf8'}, done)
          done()
      }
      ], done)
  });
  grunt.initConfig({
    yeoman: yeomanConfig,

    // watch list
    watch: {
      livereload: {
          files: [                
              '<%= yeoman.app %>/*.html',
              '{.tmp,<%= yeoman.app %>}/styles/{,**/}*.scss',
              '{.tmp,<%= yeoman.app %>}/scripts/{,**/}*.js',
              '{.tmp,<%= yeoman.app %>}/templates/{,**/}*.hbs',
              '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
              'test/spec/{,**/}*.js',
              'test/{,**/}*.js'
            ],
            tasks: ['exec:mocha'],
            options: {
              livereload: true,
              debouncedelay: 250
            }
        }
        // not used at the moment
        // hostandlebars: {
        //     files: [
        //         '<%= yeoman.app %>/templates/*.hbs'
        //     ],
        //     tasks: ['handlebars']
        // }
    },


      // mocha command
      exec: {
        mocha: {
          command: 'mocha-phantomjs http://localhost:<%= express.options.port %>/test --reporter list -t 5000 -s localToRemoteUrlAccessEnabled=true -s webSecurityEnabled=false',
        }
        , deploy_build: {
          command: 'rm -rf ./www/* && grunt build'
        }
        , deploy_clear: {
          cmd: function(user, host, path){
            deployRequiredArgs(arguments)
            host = s.sprintf('ssh -t -t %s@%s "rm -rf %s/*" &', user, host, path)
            return host
          }
        }
        , deploy_clear_light: {
          cmd: function(user, host, path){
            deployRequiredArgs(arguments)
            host = s.sprintf('ssh -t -t %s@%s "find %s -iname "*.js" -print0 -o -iname "*.css" -print0 | xargs -n1 -0 -I {} rm {}" &', user, host, path)
            return host
          }
        }
        , deploy_upload: {
          cmd: function(user, host, path){
            deployRequiredArgs(arguments)
            host = s.sprintf('scp -rC ./www/* %s@%s:%s', user, host, path)
            return host
          }
        }
        , deploy_upload_js:{
          cmd: function(user, host, path){
            deployRequiredArgs(arguments)
            var criteria = snoop().files().match(/.*\.js/)
            , c = ''
            , o = {user: user, host: host, path: path}
            , compjs
            , jsmap

            criteria.find('./www').forEach(function(f, i){
              compjs = compjs || f.path.match(/\.([^\.]*)\./)
              jsmap = jsmap || f.path.match(/\.([^\.]*)\.map/)
            })
            if(!compjs|!jsmap) throw 'missing js files.'
            o.file = compjs.input
            o.jsname = compjs[1]
            o.jsmap = jsmap.input
            o.filename = compjs.input.match(/[^\/]*\.js$/)[0]
            c += s.sprintf(' scp -C %(file)s %(user)s@%(host)s:%(path)s/scripts/%(filename)s', o)
            c += ' && '
            // c += s.sprintf(' scp -C %(jsmap)s %(user)s@%(host)s:%(path)s/scripts/main.%(jsname)s.js.map', o)
            // c += ' && '
            o.commands = c
            c = s.sprintf('ssh -t -t %(user)s@%(host)s "mkdir -p %(path)s/scripts" && %(commands)s scp -C ./www/index.html %(user)s@%(host)s:%(path)s', o)
            // console.log(c); 
            return c
          }
        }
        , deploy_upload_css:{
          cmd: function(user, host, path){
            deployRequiredArgs(arguments)
            var criteria = snoop().files().match(/.*\.css$/)
            , c = ''
            , o = {}
            criteria.find('./www').forEach(function(f){
              o = {user: user, host: host, path: path, file: f.path, filename: f.path.match(/([^\/])*$/)[0]}
              c += s.sprintf('scp -C %(file)s %(user)s@%(host)s:%(path)s/styles/%(filename)s', o)
            })
            c = s.sprintf('ssh -t -t %(user)s@%(host)s "mkdir -p %(path)s/styles" &&', o) + c
            return c
          }
        }
      },

      
      // express app
      express: {
          options: {
              // Override defaults here
              port: '9003'
          },
          dev: {
              options: {
                  script: 'server/app.js',
                  node_env: 'development',
                  args: [
                  '<%= yeoman.app %>'
                  ]
              }
          },
          prod: {
              options: {
                  script: 'server/app.js'
              }
          },
          test: {
              options: {
                  script: 'server/app.js'
              }
          }
      },
      

      // open app and test page
      open: {
          server: {
          path: 'http://forms.ddslocal.com:9003'
          }
      },

      clean: {
          dist: ['.tmp', '<%= yeoman.dist %>/*'],
          server: ['.tmp']
      },

      // linting
      jshint: {
          options: {
              jshintrc: '.jshintrc',
              reporter: require('jshint-stylish')
          },
          all: [
              'Gruntfile.js',
              '<%= yeoman.app %>/scripts/{,*/}*.js',
              '!<%= yeoman.app %>/scripts/vendor/*',
              'test/spec/{,*/}*.js'
          ]
      },

      // require
      requirejs: {
          dist: {
              // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
              options: {
                  almond: true,
                  name: 'main',
                  out:'<%= yeoman.dist %>/scripts/main.js',
                  // `name` and `out` is set by grunt-usemin
                  mainConfigFile:'<%= yeoman.app %>/scripts/init.js',
                  baseUrl: '<%= yeoman.app %>/scripts',
                  optimize: 'none',
                  paths: {
                      'templates': '../../.tmp/scripts/templates'
                  },
                  // TODO: Figure out how to make sourcemaps work with grunt-usemin
                  // https://github.com/yeoman/grunt-usemin/issues/30
                  // generateSourceMaps: true,
                  // required to support SourceMaps
                  // http://requirejs.org/docs/errors.html#sourcemapcomments
                  preserveLicenseComments: false,
                  useStrict: true,
                  wrapShim: true,
                  wrap: true,
                  uglify2: {} // https://github.com/mishoo/UglifyJS2
                  ,pragmasOnSave: {
                      //removes Handlebars.Parser code (used to compile template strings) set
                      //it to `false` if you need to parse template strings even after build
                      excludeHbsParser : true,
                      // kills the entire plugin set once it's built.
                      excludeHbs: true,
                      // removes i18n precompiler, handlebars and json2
                      excludeAfterBuild: true
                  }
                  , replaceRequireScript: [
                      {
                          files: ['<%= yeoman.dist %>/index.html'],
                          module: 'init',
                          modulePath: 'scripts/main'
                      }
                  ]
              }
          }
      },

      useminPrepare: {
          html: '<%= yeoman.app %>/index.html',
          options: {
              dest: '<%= yeoman.dist %>'
          }
      },

      usemin: {
          html: ['<%= yeoman.dist %>/{,*/}*.html'],
          css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
          options: {
              dirs: ['<%= yeoman.dist %>']
          }
      },

      imagemin: {
          dist: {
              files: [{
                  expand: true,
                  cwd: '<%= yeoman.app %>/images',
                  src: '{,*/}*.{png,jpg,jpeg}',
                  dest: '<%= yeoman.dist %>/images'
              }]
          }
      },

      cssmin: {
          dist: {
              files: {
                  '<%= yeoman.dist %>/styles/main.css': [
                      '.tmp/styles/{,*/}*.css',
                      '<%= yeoman.app %>/styles/{,*/}*.css'
                  ]
              }
          }
      },

      htmlmin: {
          dist: {
              options: {
                  /*removeCommentsFromCDATA: true,
                  // https://github.com/yeoman/grunt-usemin/issues/44
                  //collapseWhitespace: true,
                  collapseBooleanAttributes: true,
                  removeAttributeQuotes: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeOptionalTags: true*/
              },
              files: [{
                  expand: true,
                  cwd: '<%= yeoman.app %>',
                  src: '*.html',
                  dest: '<%= yeoman.dist %>'
              }]
          }
      },

      copy: {
          dist: {
              files: [{
                  expand: true,
                  dot: true,
                  cwd: '<%= yeoman.app %>',
                  dest: '<%= yeoman.dist %>',
                  src: [
                      '*.{ico,txt}',
                      '.htaccess',
                      'images/{,*/}*.{webp,gif}',
                      'img/{,*/}*.{webp,gif,jpg,png}',
                      'fonts/{,*/}*.*',
                      'bower_components/font-awesome/fonts/*'
                      // ,'bower_components/requirejs/require.js'
                  ]
              }]
          }
      },

      bower: {
          all: {
              rjsConfig: '<%= yeoman.app %>/scripts/main.js'
          }
      },

      // handlebars
      handlebars: {
          compile: {
              options: {
                  namespace: 'JST',
                  amd: true
              },
              files: {
                  '.tmp/scripts/templates.js': ['<%= yeoman.app %>/templates/**/*.hbs']
              }
          }
      },
      autoprefixer: {
          single_file: {
            options: {
              // Target-specific options go here.
            },
            src: '<%= yeoman.app %>/styles/main.css',
            dest: '<%= yeoman.app %>/styles/main.css'
          }
      },
      processhtml: {
          options: {
          },
          dist: {
            files: {
              '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html']
            }
          }
        }
      , uglify: {
          dist: {
              files: {
                  '<%= yeoman.dist %>/scripts/main.js': [
                      '<%= yeoman.dist %>/scripts/main.js'
                  ]
              }
          }
      },
      filerev: {
        options: {
          encoding: 'utf8',
          algorithm: 'md5',
          length: 8
        },
        files: {
          src: ['<%= yeoman.dist %>/scripts/main.js', '<%= yeoman.dist %>/styles/main.css']
        }
      }
  });
  
  grunt.registerTask('createDefaultTemplate', function () {
    grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
  });

  // starts express server with live testing via testserver
  grunt.registerTask('default', function (target) {
    // what is this??
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.option('force', true);

    grunt.task.run([
      'clean:server',
      'express:dev',
      'exec:mocha',
      'open',
      'watch'
    ]);
  });

  // todo fix these
  grunt.registerTask('test', [
    'clean:server',
    'createDefaultTemplate',
    'handlebars',
    'express:dev',
    'exec:mocha'
  ]);

  grunt.registerTask('test:watch', [
    'clean:server',
    'createDefaultTemplate',
    'handlebars',
    'express:dev',
    'exec:mocha',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'createDefaultTemplate',
    'htmlmin',
    'processhtml:dist',
    'handlebars',
    'requirejs',
    'useminPrepare',
    'imagemin',
    'autoprefixer',
    'cssmin',
    // 'uglify'
    'copy'
    ,'filerev'
    ,'usemin'
  ]);
  grunt.registerTask('deploy_dev', [
    'exec:deploy_build'
    , 'index:'+_proxyPath
    , 'exec:deploy_clear:'+_dev_server
    , 'exec:deploy_upload:'+_dev_server
  ]);
  grunt.registerTask('deploy_dev_light', [
    'exec:deploy_build'
    , 'index:'+_proxyPath 
    , 'exec:deploy_clear_light:'+_dev_server
    , 'exec:deploy_upload_js:'+_dev_server
    , 'exec:deploy_upload_css:'+_dev_server
  ]);
  grunt.registerTask('deploy_production', [
    'exec:deploy_build'
    , 'index:'+_proxyPath
    , 'exec:deploy_clear:'+_production_server
    , 'exec:deploy_upload:'+_production_server
  ]);
  grunt.registerTask('deploy_production_light', [
    'exec:deploy_build'
    , 'index:'+_proxyPath
    , 'exec:deploy_clear_light:'+_production_server
    , 'exec:deploy_upload_js:'+_production_server
    , 'exec:deploy_upload_css:'+_production_server
  ]);
};

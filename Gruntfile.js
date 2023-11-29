'use strict';

module.exports = function(grunt) {
  const sass = require('node-sass');
  const sassIncludePaths = [].concat(
    require('bourbon-neat').includePaths,
    require('include-media').includePath
  );


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/** \n' +
      ' * Automatically Generated - DO NOT EDIT \n' +
      ' * <%= pkg.name %> / v<%= pkg.version %> / <%= grunt.template.today("yyyy-mm-dd") %> \n' +
      ' */ \n\n',

    sourcePath: 'src',
    distPath: 'dist',
    templateDir: 'templates',
    assetDir: 'assets',
    styleDir: 'styles',
    scriptDir: 'scripts',
    imageDir: 'images',
    fontDir: 'fonts',
    dataDir: 'data',
    themeDir: '../wp-content/themes/kps3-shipcompliant',

    watch: {
      js: {
        files: '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/*.js',
        tasks: ['copy:scripts', 'uglify:js', 'copy:theme']
      },
      jsPlugins: {
        files: ['<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/vendor/**/*.js', '!<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/vendor/min/*.js'],
        tasks: ['copy:scripts', 'uglify:jsPlugins', 'copy:theme']
      },
      images: {
        files: '<%= sourcePath %>/<%= assetDir %>/<%= imageDir %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
        tasks: ['copy:images', 'copy:theme']
      },
      fonts: {
        files: '<%= sourcePath %>/<%= assetDir %>/<%= fontDir %>/**/*.{eot,svg,ttf,woff}',
        tasks: ['copy:fonts', 'copy:theme']
      },
      sass: {
        files: '<%= sourcePath %>/<%= assetDir %>/<%= styleDir %>/**/*.scss',
        tasks: ['sass', 'autoprefixer', 'usebanner', 'copy:theme']
      },
      html: {
        files: ['<%= sourcePath %>/<%= templateDir %>/**/*.hbs', '<%= sourcePath %>/<%= templateDir %>/<%= dataDir %>/**/*.yml' ],
        tasks: ['assemble']
      }
    },

    autoprefixer: {
      dist: {
        files: [
          {
            src: ['<%= distPath %>/<%= assetDir %>/<%= styleDir %>/main.css'],
            dest: '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/main.css'
          },
          {
            src: ['../wp-content/themes/kps3-shipcompliant/assets/styles/main.css'],
            dest: '../wp-content/themes/kps3-shipcompliant/assets/styles/main.css'
          },
        ]
      }
    },

    sass: {
      options: {
        includePaths: sassIncludePaths,
        implementation: sass,
        outputStyle: 'compressed',
        sourceMap: true
      },
      dist: {
        files: [
          {
            src: ['<%= sourcePath %>/<%= assetDir %>/<%= styleDir %>/main.scss'],
            dest: '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/main.css'
          },
          {
            src: ['<%= sourcePath %>/<%= assetDir %>/<%= styleDir %>/main.scss'],
            dest: '../wp-content/themes/kps3-shipcompliant/assets/styles/main.css'
          }
        ]
      }
    },

    uglify: {
      js: {
        options : {
          banner: '<%= banner %>',
          beautify : {
            ascii_only : true,
            quote_keys: true
          }
        },
        files: [{
          expand: true,
          cwd: '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>',
          src: '*.js',
          dest: '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/min'
        }]
      },
      jsPlugins: {
        options : {
          beautify : {
            ascii_only : true,
            quote_keys: true
          }
        },
        files: {
          '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/vendor/min/plugins.js': [
            '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/vendor/**/*.js',
            '!<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/vendor/min/*.js'
          ]
        }
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },
        files: {
          src: [ '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/*.css' ]
        }
      }
    },

    assemble: {
      options: {
        assets: '<%= distPath %>/<%= assetDir %>',
        layoutdir: '<%= sourcePath %>/<%= templateDir %>/layouts',
        partials: ['<%= sourcePath %>/<%= templateDir %>/components/**/*.hbs'],
        data: ['src/templates/data/**/*.yml'],
        flatten: true
      },
      site: {
        options: {
          layout: 'default.hbs'
        },
        src: ['<%= sourcePath %>/<%= templateDir %>/*.hbs'],
        dest: '<%= distPath %>'
      }
    },

    copy: {
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= sourcePath %>/<%= assetDir %>/<%= fontDir %>/',
          src: ['**'],
          dest: '<%= distPath %>/<%= assetDir %>/<%= fontDir %>/'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= sourcePath %>/<%= assetDir %>/<%= imageDir %>/',
          src: ['**'],
          dest: '<%= distPath %>/<%= assetDir %>/<%= imageDir %>/'
        }]
      },
      scripts: {
        files: [{
          expand: true,
          cwd: '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/',
          src: ['**'],
          dest: '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/'
        }]
      },
      theme: {
        files: [{
          expand: true,
          cwd: '<%= distPath %>/<%= assetDir %>/',
          src: ['**', '!scss/**'],
          dest: '<%= themeDir %>/<%= assetDir %>/'
        }]
      }
    },

    clean: {
      dist: ['<%= distPath %>/**/*', '!<%= distPath %>/.gitignore']
    }
  });

  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', [
    'clean',
    'copy',
    'uglify',
    'sass',
    'autoprefixer',
    'assemble',
    'usebanner',
    'copy:theme'
  ]);


  grunt.task.registerTask('component',
    '`grunt component:[name]` creates components/[name].hbs and components/[name].scss file and imports to main.scss', function(name) {
    var mainScss = grunt.file.read('src/assets/styles/main.scss');

    grunt.file.write('src/templates/components/' + name + '.hbs', '');

    grunt.file.write('src/assets/styles/components/_' + name + '.scss', '.' + name + ' {}');

    grunt.file.write('src/assets/styles/main.scss', mainScss + '@import "components/' + name + '";');
  })

};

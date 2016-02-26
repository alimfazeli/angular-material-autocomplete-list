var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var closureCompiler = require('gulp-closure-compiler');
var mergeStream = require('merge-stream');
var order = require('gulp-order');
var jshint = require('gulp-jshint');
var templateCache = require('gulp-angular-templatecache');

var Server = require('karma').Server;


var CONFIG = {
  jsFiles: ['src/**/*.js', '!**/*.spec.js'],
  distFiles: ['dist/**/*'],
  templates: ['src/templates/**/*'],
  allSrc: ['src/**/*']
}


gulp.task('clean', function() {
  return del(CONFIG.distFiles);
});


gulp.task('jshint', function() {
  return gulp.src()
    .pipe(jshint(CONFIG.jsFiles))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});


// Builds unminified source code
gulp.task('build-fast', ['clean'], function() {
  function buildTemplates() {
    return gulp.src(CONFIG.templates)
      .pipe(templateCache({module: 'autocomplete'}));
  }

  function buildScripts() {
    return gulp.src(CONFIG.jsFiles);
  }

  return mergeStream(buildTemplates(), buildScripts())
    .pipe(order([
      '!template.js',
      'template.js'
    ]))
    .pipe(concat('autocompleteList.js'))
    .pipe(gulp.dest('dist'));
});


// Full build with minification
gulp.task('build', ['clean'], function() {
  function buildTemplates() {
    return gulp.src(CONFIG.templates)
      .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeTagWhitespace: true,
        removeAttributeQuotes: true
      }))
      .pipe(templateCache({module: 'autocompleteList'}));
  }

  function buildScripts() {
    return gulp.src(CONFIG.jsFiles);
  }

  return mergeStream(buildTemplates(), buildScripts())
    .pipe(order([
      '!template.js',
      'template.js'
    ]))
    .pipe(concat('autocompleteList.js'))
    .pipe(gulp.dest('dist'))
    .pipe(closureCompiler({
      compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
      fileName: 'autocompleteList.min.js',
      language: 'ECMASCRIPT5_STRICT',
      compilation_level: 'ADVANCED_OPTIMIZATIONS'
    }))
    .pipe(gulp.dest('dist'));
});


// Runs unit tests
gulp.task('karma', ['build'], function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});


gulp.task('watch', ['build-fast'], function() {
  return gulp.watch(CONFIG.allSrc, ['build-fast']);
});


gulp.task('validate', ['jshint', 'karma']);
gulp.task('default', ['watch']);

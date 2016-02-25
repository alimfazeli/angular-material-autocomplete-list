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



gulp.task('clean', function() {
  return del(['dist/**/*']);
});

// gulp.task('jshint', function() {
//   return gulp.src('src/**/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'))
//     .pipe(jshint.reporter('fail'));
// });

gulp.task('build', ['clean'], function() {
  function buildTemplates() {
    return gulp.src(['src/**/*.html', 'src/**/*.svg'])
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
    return gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
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

gulp.task('watch', ['build'], function() {
  return gulp.watch(['src/**/*', '!src/.jshintrc'], ['build']);
});

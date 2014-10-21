'use strict';

var gulp      = require('gulp');
var utils     = require('gulp-util');
var cssImport = require('gulp-cssimport');
var shell     = require('gulp-shell');
var rename    = require('gulp-rename');
var debug     = require('gulp-debug');
var changed   = require('gulp-changed');

var paths = {
  css       : 'css/**/*.scss',
  assets    : 'assets/**/*.*',
  config    : 'config/**/*.*',
  layout    : 'layout/**/*.*',
  locales   : 'locales/**/*.*',
  snippets  : 'snippets/**/*.*',
  templates : 'templates/**/*.*'
};

gulp.task('concat', function () {
  return gulp.src(paths.css, {read: false})
    .pipe(cssImport())
    .pipe(rename({extname: '.scss.liquid'}))
    .pipe(gulp.dest('assets/'));
    // .pipe(shell('theme upload assets/<%= file.relative %>'));
});

gulp.task('upload', function () {
  return gulp.src([paths.assets, paths.config, paths.layout, paths.locales, paths.snippets, paths.templates])
    // .pipe(debug({verbose: true}))
    .pipe(changed([paths.assets, paths.config, paths.layout, paths.locales, paths.snippets, paths.templates]))
    .pipe(shell([
      'echo <%= f(file.path, file.cwd) %>'
    ], {
      templateData: {
        f: function (s, cwd) {
          return s.replace(cwd, '');
        }
      }
    }));
});

gulp.task('watch', function () {
  gulp.watch(paths.css, ['concat']);
  gulp.watch([paths.assets, paths.config, paths.layout, paths.locales, paths.snippets, paths.templates], ['upload']);
});


gulp.task('default', ['watch']);

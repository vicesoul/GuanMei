'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var paths = {
    coffees: ['./scripts/**/*.coffee'],
    js: ['./public/js/**/*.js'],
    css: ['./css/**/*.css'],
    scss: ['./scss/**/*.scss']
};

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['coffee', 'styles', 'watch']);

gulp.task('coffee', function() {
    gulp.src(paths.coffees)
        .pipe($.plumber())
        .pipe($.coffee({bare: true}))
        .pipe(gulp.dest('./public/js/'));
});

// Automatically Prefix CSS
gulp.task('styles:css', function () {
  return gulp.src('./public/css/**/*.css')
    .pipe($.changed('./public/css'))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('./public/css'))
    .pipe($.size({title: 'styles:css'}));
});

gulp.task('createServe', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: ['./']
    }
  });
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./public/css/'))
    .on('end', done);
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe($.sass({
      style: 'expanded',
      precision: 10,
      loadPath: ['./scss/'],
      errLogToConsole: true
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('./css'))
    .pipe($.size({title: 'styles:scss'}));
});

// Watch Files For Changes & Reload
gulp.task('serve', ['createServe', 'watch']);

gulp.task('watch', function() {
    gulp.watch(['./*.html'], reload);
    gulp.watch(paths.scss, ['scss', reload]);
});
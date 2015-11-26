var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    open = require('gulp-open'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload');

var babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify');
 
gulp
  // performs magic
  .task('browserify', function(){
    gulp.src('src/js/main.js')
      .pipe(plumber())
      .pipe(
        browserify({ 
          transform: 'reactify', 
          debug: !gulp.env.production 
        })
      )
      .pipe(concat('main.js'))
      .pipe(plumber.stop())
      .pipe(gulp.dest('dist/js'))
      .pipe(livereload());
  })

  .task('babelify', function() {
    browserify({entries: './src/js/main.js', debug: true})
      .transform('babelify', {presets: ['es2015', 'react']})
      .bundle()
      .pipe(source('main.js'))
      .pipe(gulp.dest('./dist/js/'))
      .pipe(livereload());
  })
 
  // moves source files to dist
  .task('copy', function(){
    gulp
      .src('src/index.html')
      .pipe(gulp.dest('dist'));
   
     gulp
      .src('src/assets/**/*.*')
      .pipe(gulp.dest('dist/assets'));
   
     gulp
      .src('src/img/**/*.*')
      .pipe(gulp.dest('dist/img'));
  })
 
  // local development server
  .task('connect', function(){
    connect.server({
      root: ['dist'],
      port: '8080',
      base: 'http://localhost',
      livereload: true
    });
  })  
 
  // opens the application in chrome
  .task('open', function(){
    gulp
      .src('dist/index.html')
      .pipe(
        open('', {app: 'chrome',url: 'http://localhost:8080/'})
      );
  })
 
 
  // build the application
  .task('default', ['babelify', 'copy', 'connect', 'open'])
  .task('default2', ['babelify', 'copy'])
  
  // watch for source changes
  .task('watch', ['default'], function(){
    livereload.listen();
    gulp.watch('src/**/*.*', ['default2']);
  });
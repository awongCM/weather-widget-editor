'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    gulputil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    streamify = require('gulp-streamify'),
    buffer = require('vinyl-buffer'),
    autoprefixer = require('gulp-autoprefixer'),
    merge = require('merge-stream'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    uglify = require('gulp-uglify');

//Path Settings
var pathConfig = {

    scripts: {
      //Server side js
      src_1: './src/scripts/**/*.js',
      dest_1: './public/src/',
      
      //Client side widget js
      src_2: './src/example/**/*.js',
      dest_2: './public/example/',

      main_src: './src/**/*.js'
    },
    
    styles: {
      src: './src/css/**/*.scss',
      dest: './public/css/'
    },

    fonts: {
      src: './src/assets/fonts/**/*',
      dest: './public/font/'
    },
    
    src_dir: './src',

    build_dir: './public',

    //Mocha Test files
    test_dir: ['test/unit/*.js'],

};

//Bower Path Settings
var bowerConfig = {
  bootstrap_dir: './bower_components/bootstrap-sass',
  weather_icons_dir: './bower_components/weather-icons',
  bootstrap_validator_dir: './bower_components/bootstrap-validator',

  public_dir: pathConfig.build_dir
};

//Express Server Path Settings
var serverConfig = {
  baseScript: './server.js',
  proxyHost: 'http://localhost',
  port: 9090
};

gulp.task('clean',function() {
    return del([pathConfig.build_dir]);
});

gulp.task('sass', function(){
  
  var includePaths = [
      bowerConfig.bootstrap_dir + '/assets/stylesheets',
      bowerConfig.weather_icons_dir + '/sass'
  ];
  return gulp.src(pathConfig.styles.src)
    .pipe(sass({includePaths: includePaths}))
    .on('error', handleErrors)
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
    .pipe(gulp.dest(pathConfig.styles.dest));
  
});

gulp.task('copyScripts', function() {
    var bowerScript = gulp.src([
      bowerConfig.bootstrap_dir + '/assets/javascripts/bootstrap.min.js',
      bowerConfig.bootstrap_validator_dir + '/dist/validator.min.js',
    ])
    .pipe(gulp.dest(pathConfig.scripts.dest_1));

    var serverScript = gulp.src(pathConfig.scripts.src_1)
      .pipe(gulp.dest(pathConfig.scripts.dest_1));

    var clientScript = gulp.src(pathConfig.scripts.src_2)
      .pipe(gulp.dest(pathConfig.scripts.dest_2));

    return merge(bowerScript, serverScript, clientScript);
});


//TODO: should lint all written scripts in both front-end and back-bend
gulp.task('lint',function() {
    return gulp.src([pathConfig.scripts.src])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(pathConfig.scripts.main_src, ['copyScripts']);

    gulp.watch(pathConfig.styles.src, ['sass2']);
});

gulp.task('copyFonts', function () {
  return gulp.src([
      bowerConfig.bootstrap_dir + '/assets/fonts/**/*',
      bowerConfig.weather_icons_dir + '/font/**/*',
  ]).pipe(gulp.dest(pathConfig.fonts.dest));
});

gulp.task('browserSync', ['nodemon'], function(){
  browserSync.init(null, {
      proxy: "http://localhost:9090",
      files: ["public/**/*.*"],
      port: 7000
  });
});

gulp.task('nodemon', function(cb) {
    var started = false;

    return nodemon({
        script: serverConfig.baseScript
    }).on('start', function () {
        if(!started){
            cb();
            started = true;
        }
    })
});

//Unit Testing Tasks
gulp.task('mochaTestUnit',function() {
  return gulp.src(pathConfig.test_dir, { read: false })
    .pipe(mocha({reporter: 'spec'}))
    .on('error', exitProcess);
});


gulp.task('dev',['sass', 'copyScripts', 'copyFonts', 'browserSync', 'watch']);

gulp.task('build',['sass', 'copyScripts', 'copyFonts']);

gulp.task('test', ['mochaTestUnit']);

//Callback Functions
function handleErrors (err) {
  console.log(err.toString());
  this.emit('end');
};
//A bug fix for gulp mocha plugin
function exitProcess(err){
  console.log(err.toString());
  process.exit(1);
};

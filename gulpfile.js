"use strict";

var gulp = require("gulp");
var Config = require('./gulpfile.config');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var tsc = require('gulp-typescript');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var karma = require('gulp-karma');

var config = new Config();

// ['concat-compiled-ts-tests', 'template-cache', 'less'],

gulp.task('compile-ts-tests', ['clean-ts'], function () {
    var sourceTsFiles = [config.libraryTypeScriptDefinitions,
                         config.appTypeScriptReferences,
                        './test/**/*.ts'];

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(sourcemaps.init())
                       .pipe(tsc({
                           target: 'ES5',
                           declarationFiles: false,
                           noExternalResolve: true
                       }));

    tsResult.dts.pipe(gulp.dest('./test/'));
    return tsResult.js
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest('./test/'));
});

gulp.task('concat-compiled-ts-tests', ['compile-ts-tests'], function () {
    return gulp.src(['./test/**/*.js', '!./test/**/*.map.js'])
      .pipe(concat('tests.js'))
      .pipe(gulp.dest('./test/'));
});

gulp.task('run-unit-tests', ['concat-compiled-ts-tests'], function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/rx/dist/rx.all.compat.min.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/rx-angular/dist/rx.angular.min.js',
        'dist/virtualFor.js',
        'test/tests.js'])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

gulp.task('clean-ts', function () {
    var typeScriptGenFiles = [config.tsOutputPath, './test/**/*.js'];

    return gulp.src(typeScriptGenFiles, { read: false })
        .pipe(clean());
});

gulp.task('compress', ['concat-compiled-ts'], function () {
    return gulp.src('./dist/virtualFor.js')
      .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
      .pipe(gulp.dest('dist'));
});


gulp.task('compile-ts', ['clean-ts'], function () {
    var sourceTsFiles = [config.allTypeScript,                
                         config.libraryTypeScriptDefinitions, 
                         config.appTypeScriptReferences];     

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(sourcemaps.init())
                       .pipe(tsc({
                           target: 'ES5',
                           declarationFiles: false,
                           noExternalResolve: true
                       }));

    tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
    return tsResult.js
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(config.tsOutputPath));
});


gulp.task('concat-compiled-ts', ['compile-ts'], function () {
    return gulp.src(config.allJavaScript)
      .pipe(concat('virtualFor.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', ['concat-compiled-ts'], function () {
    gulp.watch(config.allFiles, ['clean-ts', 'compile-ts', 'concat-compiled-ts', 'compress', 'compile-ts-tests', 'concat-compiled-ts-tests', 'run-unit-tests']);
});

gulp.task('default', ['clean-ts', 'compile-ts', 'concat-compiled-ts','compress','compile-ts-tests','concat-compiled-ts-tests', 'run-unit-tests', 'watch']);
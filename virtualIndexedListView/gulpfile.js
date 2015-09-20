"use strict";

var gulp = require("gulp");
var Config = require('./gulpfile.config');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var tsc = require('gulp-typescript');

var config = new Config();

gulp.task('clean-ts', function () {
    var typeScriptGenFiles = [config.tsOutputPath];

    return gulp.src(typeScriptGenFiles, { read: false })
        .pipe(clean());
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
      .pipe(concat('virtualIndexListView.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', ['concat-compiled-ts'], function () {
    gulp.watch(config.allFiles, ['clean-ts', 'compile-ts', 'concat-compiled-ts']);
});

gulp.task('default', ['clean-ts', 'compile-ts', 'concat-compiled-ts', 'watch']);
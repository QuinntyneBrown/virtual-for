'use strict';

var GulpConfig = (function () {

    function GulpConfig() {

        this.allTypeScriptTests = './test/**/*.ts';

        this.source = './src/';
        this.tsOutputPath = this.source + '/js';
        this.allJavaScript = [this.source + '/js/**/*.js', '!' + this.source + '/js/**/*.map.js'];
        this.allTypeScript = this.source + '/**/*.ts';
        this.allFiles = [this.allTypeScript, this.allTypeScriptTests];
        this.typings = './typings/';
        this.libraryTypeScriptDefinitions = './typings/**/*.ts';
        this.appTypeScriptReferences = this.typings + 'typeScriptApp.d.ts';
    }

    return GulpConfig;
})();

module.exports = GulpConfig;

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['jasmine'],

        coverageReporter: {
            type: 'text',
            dir: 'coverage/',
            file: null
        },

        exclude: [],

        reporters: ['progress', 'coverage'],

        preprocessors: { 'dist/virtualFor.js': ['coverage'] },

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['PhantomJS'],

        singleRun: true,

    });
};

module.exports = function(config){
  config.set({

    frameworks: [
      'jasmine'
    ],

    files: [
      {pattern: 'bower_components/es5-shim/es5-shim.js', included: true}, //for old IE
      'bower_components/json/json2.js', //for old IE
      'bower_components/es6-promise/promise.js', //for non ES6 browsers

      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon/pkg/sinon-ie.js',
      'bower_components/requirejs/require.js',
      'node_modules/karma-requirejs/lib/adapter.js',

      'node_modules/jazzmine/bin/jazzmine.min.js',
      'node_modules/jasmine-sinon/lib/jasmine-sinon.js',
      {pattern: 'bower_components/knockout/dist/knockout.debug.js', included: false},

      'tests/tests-main.js',
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'tests/Mocks/**/*.js', included: false},
      {pattern: 'tests/Given/**/*.js', included: false},
      'tests/Modules/**/*.js',
      'src/**/*.tests.js'
    ],

    exclude: [

    ],

    reporters: ['dots'],

    autoWatch: true

  });
};
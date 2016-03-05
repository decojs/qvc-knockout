
jazzmine.requireConfig({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: {
    "Mocks": "tests/Mocks",
    "Given": "tests/Given",
    "knockout": "bower_components/knockout/dist/knockout.debug"
  },
  packages: [
      { name: 'qvc', location: 'src', main: 'qvc' }
  ]
});

ES6Promise.polyfill();

jazzmine.onReady(window.__karma__.start);
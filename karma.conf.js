module.exports = function(config) {

  var SRC = [
    'dist/autocompleteList.js',
    'src/**/*.spec.js'
  ];

  var DEPENDENCIES = [
    'node_modules/angular/angular.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-aria/angular-aria.js',
    'node_modules/angular-mocks/angular-mocks.js',
    'node_modules/angular-material/angular-material.js',
  ];

  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    files: DEPENDENCIES.concat(SRC),

    reporters: ['progress'],
    browsers: ['Chrome'],
    singleRun: true,

    client: {
      clearContext: false
    }
  });
}

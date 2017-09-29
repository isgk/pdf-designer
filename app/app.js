'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.bootstrap',
  'ui.bootstrap.contextMenu',
  'angularResizable',
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.pdfDesigner',
  'myApp.version',
  angularDragula(angular)
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/pdf-designer'});
}]);

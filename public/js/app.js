var fileUploadApp = angular.module('fileUploadApp', [
    'ngRoute',
    'app',
]);

fileUploadApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.
    when('/login', {
        templateUrl: '../partials/login.html',
        controller: 'UserController',
        controllerAs: 'vm'
    }).
    when('/signup', {
        templateUrl: '../partials/signup.html',
        controller: 'UserController',
        controllerAs: 'vm'
    }).
    when('/welcome', {
        templateUrl: '../partials/welcome.html',
        controller: 'UserController',
        controllerAs: 'vm'
    }).
    when('/', {
        templateUrl: '../partials/index.html',
        controller: 'FileController',
        controllerAs: 'vm'
    }).
    otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);

}]);

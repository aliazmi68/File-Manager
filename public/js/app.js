var fileUploadApp = angular.module('fileUploadApp', [
    'ngRoute',
    'app',
]);

fileUploadApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.
    when('/login', {
        templateUrl: '../webcloud/public/partials/login.html',
        controller: 'UserController',
        controllerAs: 'vm'
    }).
    when('/signup', {
        templateUrl: '../webcloud/public/partials/signup.html',
        controller: 'UserController',
        controllerAs: 'vm'
    }).
    when('/welcome', {
        templateUrl: '../webcloud/public/partials/welcome.html',
        controller: 'UserController',
        controllerAs: 'vm'
    }).
    when('/', {
        templateUrl: '../webcloud/public/partials/index.html',
        controller: 'FileController',
        controllerAs: 'vm'
    }).
    otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);

}]);

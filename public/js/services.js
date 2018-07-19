angular.module('app').factory('appService', [ '$http', '$q', function ($http, $q) {

    var root = {};

    root.getfiles = function () {
        $http.get('/file',
            {
                user_id: name,
            }).
        then(function(response) {
            console.log(response);
            // localStorageService.set('token', response.data.token);
            // onSuccess(response);

        }, function(response) {
            console.log(response);
            // onError(response);

        });
    };


    root.callAPI = function (method, url, data, header) {
        var deferred = $q.defer();
        $http({
            method : method,
            url : url,
            data: data,
            headers: header
        }).then(function(response) {
                deferred.resolve(response);
            }, function(response){
                deferred.reject(response);
            });
        return deferred.promise;
    };

    return root;
}]);



// var fileUploadAppServices = angular.module('fileUploadAppServices', [
//     'LocalStorageModule'
// ]);

// fileUploadAppServices.factory('userService', ['$http', 'localStorageService', function($http, localStorageService) {
//
//     function checkIfLoggedIn() {
//
//         if(localStorageService.get('token'))
//             return true;
//         else
//             return false;
//
//     }
//
//     function signup(name, email, password, onSuccess, onError) {
//
//         $http.post('/api/auth/signup',
//             {
//                 name: name,
//                 email: email,
//                 password: password
//             }).
//         then(function(response) {
//
//             localStorageService.set('token', response.data.token);
//             onSuccess(response);
//
//         }, function(response) {
//
//             onError(response);
//
//         });
//
//     }
//
//     function login(email, password, onSuccess, onError){
//
//         $http.post('/api/auth/login',
//             {
//                 email: email,
//                 password: password
//             }).
//         then(function(response) {
//
//             localStorageService.set('token', response.data.token);
//             onSuccess(response);
//
//         }, function(response) {
//
//             onError(response);
//
//         });
//
//     }
//
//     function logout(){
//
//         localStorageService.remove('token');
//
//     }
//
//     function getCurrentToken(){
//         return localStorageService.get('token');
//     }
//
//     return {
//         checkIfLoggedIn: checkIfLoggedIn,
//         signup: signup,
//         login: login,
//         logout: logout,
//         getCurrentToken: getCurrentToken
//     }
//
// }]);


// fileUploadAppServices.factory('fileUploadService', ['$http', 'userService', function($http, userService) {
//
//     function getFiles(onSuccess, onError){
//         console.log('reached file service');
//         $http({
//             url: '/file',
//             method: "GET"
//
//         }).success(function (data) {
//             console.log(data);
//             // $scope.trans = data.transactions;
//             // console.log($scope.trans);
//
//         }).error(function (data) {
//             console.log(data);
//             // console.log('Error');
//         });

        // Restangular.all('api/books').getList().then(function(response){
        //
        //     onSuccess(response);
        //
        // }, function(){
        //
        //     onError(response);
        //
        // });
    // }

    // function getById(bookId, onSuccess, onError){
    //
    //     Restangular.one('api/books', bookId).get().then(function(response){
    //
    //         onSuccess(response);
    //
    //     }, function(response){
    //
    //         onError(response);
    //
    //     });
    //
    // }
    //
    // function create(data, onSuccess, onError){
    //
    //     Restangular.all('api/books').post(data).then(function(response){
    //
    //         onSuccess(response);
    //
    //     }, function(response){
    //
    //         onError(response);
    //
    //     });
    //
    // }
    //
    // function update(bookId, data, onSuccess, onError){
    //
    //     Restangular.one("api/books").customPUT(data, bookId).then(function(response) {
    //
    //             onSuccess(response);
    //
    //         }, function(response){
    //
    //             onError(response);
    //
    //         }
    //     );
    //
    // }
    //
    // function remove(bookId, onSuccess, onError){
    //     Restangular.one('api/books/', bookId).remove().then(function(){
    //
    //         onSuccess();
    //
    //     }, function(response){
    //
    //         onError(response);
    //
    //     });
    // }

// }]);
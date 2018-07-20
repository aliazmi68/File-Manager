angular.module('app').factory('appService', [ '$http', '$q', function ($http, $q) {

    var root = {};

    //  Service to call Laravel routes
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

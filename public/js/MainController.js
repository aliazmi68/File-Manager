var app = angular.module('app', []);


/*  ====================  User Controller ====================  */
app.controller("UserController", function($scope, appService, $window, $location){

    var vm = this;

    vm.loginError = false;
    vm.passValidateError = false;

    getLoggedInUser();

    vm.doSignup = function() {
        vm.signupErrors={};
        if(validatePassword(vm.password)){
            vm.data={
                username:vm.username,
                email:vm.email,
                password:vm.password
            };
            appService.callAPI('POST', '/user', vm.data, {})
                .then(function(response){
                    vm.user = (response.data);
                    if(vm.user.id>0){
                        $window.location = '/';
                    }
                }, function(response){
                    vm.signupErrors = response.data.errors;
                });
        } else{
            vm.passValidateError = true;
        }

    }

    vm.doLogin = function() {
        vm.data={
            username:vm.username,
            password:vm.password
        };
        appService.callAPI('POST', 'auth/login', vm.data, {})
        .then(function(response){
            vm.user = (response.data);
            if(typeof vm.user.id !== 'undefined' && vm.user.id>0){
                $window.location = '/';
            }
        }, function(response){
            vm.loginError = true;
        });
    }

    function validatePassword(pass){
        var rule = 0;
        var types = { "upperCase": 0, "lowerCase": 0, "numbers": 0, "specialChars": 0 };

        for (var i=0; i<pass.length; i++) {
            char = pass.charAt(i);
            if(!isNaN(char)) {
                types["numbers"]++;
            } else if (/^[a-zA-Z0-9]*$/.test(char) == false) {
                types["specialChars"]++;
            } else if(char == char.toLowerCase()) {
                types["lowerCase"]++;
            } else if(char == char.toUpperCase()){
                types["upperCase"]++;
            }
        }

        angular.forEach(types, function (type) {
            if(type>0){
                rule++;
            }
        });

        return rule>1;
    }

    function getLoggedInUser(){
        appService.callAPI('GET', 'auth/getLoggedInUser', {}, {})
            .then(function(response){
                vm.user = (response.data);
                if(typeof vm.user.id !== 'undefined' && vm.user.id>0){
                    $window.location = '/';
                }
            }, function(response){});
    }
});

/*  ====================  File Controller ====================  */
app.controller("FileController", function($scope, appService, $window, $http){
    var vm = this;

    vm.errors = {};
    vm.files = {};
    vm.user = {};
    var formData = new FormData();

    authorizeUser();
    listFiles();

    vm.doLogout = function() {
        appService.callAPI('GET', 'auth/logout', {}, {})
            .then(function(response){
                $window.location = '/login';
            }, function(response){

            });
    }


    vm.uploadFile = function () {
        formData.append('user_id', vm.user.id);
        vm.header = {
            'Content-Type': undefined
        }

        vm.fileUploadErrors = [];
        appService.callAPI('POST', '/file', formData, vm.header)
            .then(function success(response) {
                vm.files = response.data.files;

                //  Empty file upload element
                angular.forEach(
                    angular.element("input[type='file']"), function(inputElement) {
                        angular.element(inputElement).val(null);

                });

                // alert("Image has been uploaded successfully!");
            }, function error(response) {
                vm.fileUploadErrors = response.data.errors;
            });
    };

    vm.setFile = function ($files) {
        formData.append('file', $files[0]);
    };

    vm.downloadFile = function(file){
        window.open('/file/download?name='+file.filename+'&type='+file.type+'&id='+file.id);
    }

    vm.deleteFile = function (file) {
        var confirm = confirm("Do you really want to delete "+file.filename + " ?");
        if (confirm == true) {
            appService.callAPI('DELETE', '/file/'+file.id+'.'+file.type, {}, vm.header)
                .then(function success(response) {
                    vm.files = response.data.files;
                }, function error(response) {
                    vm.errors = response.data.errors;
                });
        }
    };

    vm.renameFile = function (file) {
        var newFileName = prompt("Please enter new name of file", "");
        if (newFileName !== null && newFileName !== '' && newFileName !== 'undefined') {
            vm.data = {
                filename: newFileName
            };
            appService.callAPI('PUT', '/file/'+file.id, vm.data, {})
                .then(function success(response) {
                    vm.files = response.data.files;
                }, function error(response) {
                    vm.errors = response.data.errors;
                });
        }
    }

    // Assigning the suitable unit for the file size
    vm.getFileSize = function (size) {
        var sizeUnits = ['bytes', 'KB', 'MB', 'GB'];
        for(var i=0; i<sizeUnits.length; i++){
            if(Math.floor(Math.round((size/1024) * 100) / 100) == 0){
                return size + ' '+sizeUnits[i];
            } else{
                size = Math.round((size/1024) * 100) / 100;
            }
        }
        // return size;
    }

    function authorizeUser(){
        appService.callAPI('GET', 'auth/getLoggedInUser', {}, {})
            .then(function(response){
                vm.user = (response.data);
                if(typeof vm.user.id == 'undefined' || !vm.user.id>0){
                    $window.location = '/login';
                }
            }, function(response){});
    }

    function listFiles() {
        vm.header = {
            'Content-Type': undefined
        }

        appService.callAPI('GET', '/file', {}, vm.header)
            .then(function success(response) {
                vm.files = response.data.files;
            }, function error(response) {

            });
    };
});

/*  ====================  File Directive ====================  */
app.directive('ngFile', ['$parse', function ($parse) {
    return {
        link: function file_links(scope, element, attrs) {
            var onChange = $parse(attrs.ngFile);
            element.on('change', function (event) {
                onChange(scope, {$files: event.target.files});
            });
        }
    }
}]);

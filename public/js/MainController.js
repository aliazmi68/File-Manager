var app = angular.module('app', []);


/*  ====================  User Controller ====================  */
app.controller("UserController", function($scope, appService, $window, $location){

    var vm = this;

    vm.loginError = false;
    vm.passValidateError = false;

    getLoggedInUser();

    //  Function for User Signup
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

    //  Function for User Login
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

    //  Function to validate password
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

    //  Function to get logged-in user object
    function getLoggedInUser(){
        appService.callAPI('GET', 'auth/getLoggedInUser', {}, {})
            .then(function(response){
                vm.user = (response.data);
                if(typeof vm.user.id !== 'undefined' && vm.user.id>0 && vm.user.status){
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
    vm.loader = false;
    var formData = new FormData();

    authorizeUser();
    listFiles();

    //  Function for User Logout
    vm.doLogout = function() {
        appService.callAPI('GET', 'auth/logout', {}, {})
            .then(function(response){
                $window.location = '/login';
            }, function(response){

            });
    }

    //  Function for File Upload
    vm.uploadFile = function () {
        vm.loader = true;
        formData.append('user_id', vm.user.id);
        vm.header = {
            'Content-Type': undefined
        }

        vm.fileUploadErrors = [];
        appService.callAPI('POST', '/file', formData, vm.header)
            .then(function success(response) {
                vm.loader = false;
                vm.files = response.data.files;

                //  Empty file upload element
                angular.forEach(
                    angular.element("input[type='file']"), function(inputElement) {
                        angular.element(inputElement).val(null);

                });

            }, function error(response) {
                vm.loader = false;
                vm.fileUploadErrors = response.data.errors;
            });
    };

    //  Function to set file to formData object
    vm.setFile = function ($files) {
        formData.append('file', $files[0]);
    };

    //  Function to download file
    vm.downloadFile = function(file){
        window.open('/file/download/'+file.id);
    }

    //  Function to delete file
    vm.deleteFile = function (file) {
        var conf = confirm("Do you really want to delete "+file.filename + " ?");
        if (conf == true) {
            vm.loader = true;
            appService.callAPI('DELETE', '/file/'+file.id+'.'+file.type, {}, vm.header)
                .then(function success(response) {
                    vm.loader = false;
                    vm.files = response.data.files;
                }, function error(response) {
                    vm.loader = false;
                    vm.errors = response.data.errors;
                });
        }
    };

    //  Function to rename file
    vm.renameFile = function (file) {
        var newFileName = prompt("Please enter new name of file", "");
        if (newFileName !== null && newFileName !== '' && newFileName !== 'undefined') {
            vm.data = {
                filename: newFileName
            };
            vm.loader = true;
            appService.callAPI('PUT', '/file/'+file.id, vm.data, {})
                .then(function success(response) {
                    vm.loader = false;
                    vm.files = response.data.files;
                }, function error(response) {
                    vm.loader = false;
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

    //  Function to Authorize User
    function authorizeUser(){
        vm.loader = true;
        appService.callAPI('GET', 'auth/getLoggedInUser', {}, {})
            .then(function(response){
                vm.loader = false;
                vm.user = (response.data);
                if(typeof vm.user.id == 'undefined' || !vm.user.id>0 || angular.equals(vm.user, {})){
                    $window.location = '/login';
                }
                // if(!vm.user.status && !isEmpty(vm.user)){
                //     vm.loader = false;
                //     $window.location = '/welcome';
                // }
            }, function(response){});
    }

    //  Function to list user files
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

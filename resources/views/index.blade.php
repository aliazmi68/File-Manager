<!DOCTYPE html>
<html lang="en" ng-app="fileUploadApp">
    <head>
        <base href="/">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>File Uploading Application</title>

        <link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="bower_components/jquery/dist/jquery.min.js"></script>
        <script src="bower_components/angular/angular.min.js"></script>
        <script src="bower_components/angular-route/angular-route.min.js"></script>
        <script src="bower_components/angular-local-storage/dist/angular-local-storage.min.js"></script>
        <script src="bower_components/restangular/dist/restangular.min.js"></script>
        <script src="js/app.js"></script>
        <script src="js/MainController.js"></script>
        <script src="js/services.js"></script>

    </head>

    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h1 style="margin-top: 15px; color: cornflowerblue">File Uploading Application</h1>
                </div>
            </div>
            <div ng-view></div>
        </div>


        <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    </body>
</html>

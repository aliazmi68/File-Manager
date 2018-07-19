<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/




Route::group(
    [
        'middleware' => ['authRequest'],
    ], function () {
    //  User Auth and Login/Logout
    Route::post('auth/login', 'AuthController@login');
    Route::get('auth/logout', 'AuthController@logout');
    Route::get('auth/getLoggedInUser', 'AuthController@getLoggedInUser');

//  File Related Routes
    Route::get('file/download', 'FileController@downloadFile');
    Route::resource('file', 'FileController');

//  User Related Routes
    Route::resource('user', 'UserController');

    Route::get('*', function() {
        return view('index');
    });

});
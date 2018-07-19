<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        //  User credentials for Auth
        $data = [
            'username' => $request->username,
            'password' => $request->password
        ];

        //  If user is unauthorized
        if(!Auth::attempt($data)){
            return response('Unauthorized', 401);
        }

        return response(Auth::user(), 200);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response('User Logged out', 200);
    }


    public function getLoggedInUser()
    {
        return response(Auth::user(), 200);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

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

    public function activate($code)
    {
        User::where('activation_code', $code)
            ->update(['status' => 1]);

        return view('index');
    }
}

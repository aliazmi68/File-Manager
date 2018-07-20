<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthorizeReuqest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(strpos(Request::capture()->root(), env('AUTHORIZED_URL')) === false){
            return response('Unauthorized', 401);
        }

        return $next($request);
    }
}

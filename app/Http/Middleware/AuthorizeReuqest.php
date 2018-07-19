<?php

namespace App\Http\Middleware;

use Closure;

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
        dd($request->getHttpHost());

//        if(strpos(Request::capture()->root(), env('APP_API_URL'))){
//            return response('Unauthorized', 401);
//        }

        return $next($request);
    }
}

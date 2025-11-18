<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddJsonHeader
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');

        $response = $next($request);

        if ($response instanceof \Illuminate\Http\JsonResponse) {
            $response->header('Content-Type', 'application/json');
        }

        return $response;
    }
}

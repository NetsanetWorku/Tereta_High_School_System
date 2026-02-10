<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            Log::warning('RoleMiddleware: Unauthenticated request', [
                'endpoint' => $request->path(),
                'method' => $request->method(),
                'required_roles' => $roles
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $user = $request->user();
        $userRole = $user->role;
        $hasAccess = in_array($userRole, $roles);

        // Log authorization check
        Log::info('RoleMiddleware: Authorization check', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'user_role' => $userRole,
            'required_roles' => $roles,
            'has_access' => $hasAccess,
            'endpoint' => $request->path(),
            'method' => $request->method()
        ]);

        // Check if user has required role
        if (!$hasAccess) {
            Log::warning('RoleMiddleware: Access denied', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_role' => $userRole,
                'required_roles' => $roles,
                'endpoint' => $request->path()
            ]);

            $response = [
                'success' => false,
                'message' => 'Unauthorized - Insufficient permissions'
            ];

            // Add diagnostic info in development environment
            if (config('app.debug')) {
                $response['debug'] = [
                    'user_id' => $user->id,
                    'user_role' => $userRole,
                    'required_roles' => $roles,
                    'endpoint' => $request->path()
                ];
            }

            return response()->json($response, 403);
        }

        Log::info('RoleMiddleware: Access granted', [
            'user_id' => $user->id,
            'endpoint' => $request->path()
        ]);

        return $next($request);
    }
}

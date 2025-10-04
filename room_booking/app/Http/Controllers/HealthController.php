<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    /**
     * Check database connectivity and return health status
     */
    public function check(): JsonResponse
    {
        try {
            // Test database connection
            DB::connection()->getPdo();
            
            // Test a simple query
            $roomCount = DB::table('rooms')->count();
            
            return response()->json([
                'success' => true,
                'status' => 'healthy',
                'database' => 'connected',
                'message' => 'All systems operational',
                'data' => [
                    'database_connected' => true,
                    'rooms_count' => $roomCount,
                    'timestamp' => now()->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 'unhealthy',
                'database' => 'disconnected',
                'message' => 'Database connection failed',
                'data' => [
                    'database_connected' => false,
                    'error' => $e->getMessage(),
                    'timestamp' => now()->toISOString()
                ]
            ], 503);
        }
    }

    /**
     * Get basic system info for fallback content
     */
    public function fallback(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'status' => 'fallback',
            'message' => 'Using fallback content',
            'data' => [
                'app_name' => config('app.name', 'Hostel Room Booking'),
                'app_url' => config('app.url'),
                'timestamp' => now()->toISOString(),
                'fallback_mode' => true
            ]
        ]);
    }
}

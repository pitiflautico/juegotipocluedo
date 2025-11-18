<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameCase;
use Illuminate\Http\Request;

class GameCaseController extends Controller
{
    /**
     * Get all available cases.
     */
    public function index(Request $request)
    {
        $query = GameCase::query();

        // Filter by difficulty
        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $cases = $query
            ->orderBy('difficulty')
            ->orderBy('title')
            ->get()
            ->map(function ($case) {
                // Don't expose solution details in listing
                return [
                    'id' => $case->id,
                    'title' => $case->title,
                    'description' => $case->description,
                    'difficulty' => $case->difficulty,
                    'created_at' => $case->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $cases,
        ]);
    }

    /**
     * Get case details (without solution).
     */
    public function show(string $id)
    {
        $case = GameCase::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $case->id,
                'title' => $case->title,
                'description' => $case->description,
                'difficulty' => $case->difficulty,
                'meta_json' => $case->meta_json,
                'created_at' => $case->created_at,
            ],
        ]);
    }
}

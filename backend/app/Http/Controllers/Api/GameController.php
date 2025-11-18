<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Get user's game history.
     */
    public function index(Request $request)
    {
        $games = $request->user()
            ->games()
            ->with(['gameCase', 'template', 'players.user'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $games,
        ]);
    }

    /**
     * Get game details.
     */
    public function show(Request $request, string $id)
    {
        $game = Game::with(['gameCase', 'template', 'players.user'])
            ->findOrFail($id);

        // Check if user participated in this game
        $userParticipated = $game->players()
            ->where('user_id', $request->user()->id)
            ->exists();

        if (!$userParticipated) {
            return response()->json([
                'success' => false,
                'message' => 'You did not participate in this game',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $game,
        ]);
    }

    /**
     * Get game history with filters.
     */
    public function history(Request $request)
    {
        $query = $request->user()->games();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->where('started_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->where('started_at', '<=', $request->to_date);
        }

        $games = $query
            ->with(['gameCase', 'template'])
            ->orderBy('started_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $games,
        ]);
    }
}

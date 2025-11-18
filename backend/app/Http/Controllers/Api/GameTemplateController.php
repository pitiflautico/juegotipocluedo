<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameTemplate;
use Illuminate\Http\Request;

class GameTemplateController extends Controller
{
    /**
     * Get all available templates.
     */
    public function index(Request $request)
    {
        $query = GameTemplate::query();

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $templates = $query
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $templates,
        ]);
    }

    /**
     * Get template details.
     */
    public function show(string $id)
    {
        $template = GameTemplate::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $template,
        ]);
    }
}

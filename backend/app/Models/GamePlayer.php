<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GamePlayer extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'game_id',
        'user_id',
        'role_code',
        'is_traitor',
        'result',
        'stats_json',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_traitor' => 'boolean',
            'stats_json' => 'array',
        ];
    }

    /**
     * Get the game for this player.
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * Get the user for this player.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if this player won.
     */
    public function hasWon(): bool
    {
        return $this->result === 'win';
    }

    /**
     * Get role information.
     */
    public function getRoleAttribute(): ?array
    {
        $roles = config('game.roles');
        return $roles[$this->role_code] ?? null;
    }
}

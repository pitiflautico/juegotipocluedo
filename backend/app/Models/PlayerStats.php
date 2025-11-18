<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerStats extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'games_played',
        'games_won',
        'games_lost',
        'total_time_played',
        'last_game_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'games_played' => 'integer',
            'games_won' => 'integer',
            'games_lost' => 'integer',
            'total_time_played' => 'integer',
            'last_game_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the stats.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate win rate.
     */
    public function getWinRateAttribute(): float
    {
        if ($this->games_played === 0) {
            return 0;
        }

        return round(($this->games_won / $this->games_played) * 100, 2);
    }

    /**
     * Update stats after a game.
     */
    public function updateAfterGame(bool $won, int $duration): void
    {
        $this->games_played++;

        if ($won) {
            $this->games_won++;
        } else {
            $this->games_lost++;
        }

        $this->total_time_played += $duration;
        $this->last_game_at = now();
        $this->save();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'case_id',
        'template_id',
        'started_at',
        'ended_at',
        'status',
        'players_count',
        'winner_team',
        'result_json',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'result_json' => 'array',
            'winner_team' => 'boolean',
        ];
    }

    /**
     * Get the case for this game.
     */
    public function gameCase(): BelongsTo
    {
        return $this->belongsTo(GameCase::class, 'case_id');
    }

    /**
     * Get the template for this game.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(GameTemplate::class, 'template_id');
    }

    /**
     * Get the players for this game.
     */
    public function players(): HasMany
    {
        return $this->hasMany(GamePlayer::class);
    }

    /**
     * Check if game is in progress.
     */
    public function isInProgress(): bool
    {
        return $this->status === 'playing';
    }

    /**
     * Check if game is finished.
     */
    public function isFinished(): bool
    {
        return $this->status === 'finished';
    }
}

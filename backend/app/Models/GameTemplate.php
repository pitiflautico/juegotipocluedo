<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameTemplate extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'layout_json',
        'max_players',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'layout_json' => 'array',
            'max_players' => 'integer',
        ];
    }

    /**
     * Get the games that used this template.
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class, 'template_id');
    }

    /**
     * Get rooms from layout.
     */
    public function getRooms(): array
    {
        return $this->layout_json['rooms'] ?? [];
    }

    /**
     * Get connections between rooms.
     */
    public function getConnections(): array
    {
        return $this->layout_json['connections'] ?? [];
    }
}

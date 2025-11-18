<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameCase extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'killer_npc_id',
        'weapon_code',
        'room_code',
        'motive_text',
        'difficulty',
        'meta_json',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'meta_json' => 'array',
            'difficulty' => 'integer',
        ];
    }

    /**
     * Get the games that used this case.
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class, 'case_id');
    }

    /**
     * Get solution data.
     */
    public function getSolution(): array
    {
        return [
            'killer_npc_id' => $this->killer_npc_id,
            'weapon_code' => $this->weapon_code,
            'room_code' => $this->room_code,
            'motive_text' => $this->motive_text,
        ];
    }

    /**
     * Check if a guess is correct.
     */
    public function checkGuess(array $guess): bool
    {
        return $guess['killer_npc_id'] === $this->killer_npc_id
            && $guess['weapon_code'] === $this->weapon_code
            && $guess['room_code'] === $this->room_code;
    }
}

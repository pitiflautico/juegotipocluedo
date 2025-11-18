<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('game_players', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('game_id')->constrained('games')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role_code', 50);
            $table->boolean('is_traitor')->default(false);
            $table->enum('result', ['win', 'lose', 'abandoned'])->nullable();
            $table->jsonb('stats_json')->nullable();
            $table->timestamps();

            $table->index(['game_id', 'user_id']);
            $table->index('role_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_players');
    }
};

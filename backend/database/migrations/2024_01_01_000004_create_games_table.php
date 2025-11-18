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
        Schema::create('games', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('case_id')->constrained('game_cases')->onDelete('cascade');
            $table->foreignUuid('template_id')->constrained('game_templates')->onDelete('cascade');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->enum('status', ['waiting', 'playing', 'finished', 'abandoned'])->default('waiting');
            $table->integer('players_count')->default(0);
            $table->boolean('winner_team')->nullable();
            $table->jsonb('result_json')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('started_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};

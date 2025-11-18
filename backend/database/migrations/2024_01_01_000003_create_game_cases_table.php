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
        Schema::create('game_cases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 200);
            $table->text('description');
            $table->integer('killer_npc_id');
            $table->string('weapon_code', 50);
            $table->string('room_code', 50);
            $table->text('motive_text');
            $table->integer('difficulty')->default(1);
            $table->jsonb('meta_json')->nullable();
            $table->timestamps();

            $table->index('difficulty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_cases');
    }
};

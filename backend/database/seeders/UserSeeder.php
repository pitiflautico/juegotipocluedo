<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PlayerStats;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@clubmisterium.com',
            'password' => Hash::make('password'),
        ]);

        PlayerStats::create(['user_id' => $admin->id]);

        // Create test users
        $testUsers = [
            ['name' => 'Detective García', 'email' => 'detective@test.com'],
            ['name' => 'Dra. Chen', 'email' => 'scientist@test.com'],
            ['name' => 'Madame Zelda', 'email' => 'visionary@test.com'],
            ['name' => 'Prof. Cromwell', 'email' => 'chronicler@test.com'],
            ['name' => 'Shadow', 'email' => 'infiltrator@test.com'],
            ['name' => 'MacGyver', 'email' => 'handyman@test.com'],
        ];

        foreach ($testUsers as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
            ]);

            PlayerStats::create(['user_id' => $user->id]);
        }

        $this->command->info('Created 7 users (1 admin + 6 test users)');
    }
}

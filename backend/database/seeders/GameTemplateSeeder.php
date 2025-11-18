<?php

namespace Database\Seeders;

use App\Models\GameTemplate;
use Illuminate\Database\Seeder;

class GameTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Mansion Template
        GameTemplate::create([
            'name' => 'Mansión Victorian',
            'type' => 'mansion',
            'max_players' => 6,
            'layout_json' => [
                'rooms' => [
                    ['code' => 'entrance', 'name' => 'Entrada Principal', 'type' => 'common', 'x' => 400, 'y' => 100],
                    ['code' => 'library', 'name' => 'Biblioteca', 'type' => 'study', 'x' => 200, 'y' => 200],
                    ['code' => 'ballroom', 'name' => 'Salón de Baile', 'type' => 'social', 'x' => 600, 'y' => 200],
                    ['code' => 'kitchen', 'name' => 'Cocina', 'type' => 'service', 'x' => 100, 'y' => 400],
                    ['code' => 'study', 'name' => 'Despacho', 'type' => 'private', 'x' => 300, 'y' => 400],
                    ['code' => 'conservatory', 'name' => 'Invernadero', 'type' => 'garden', 'x' => 700, 'y' => 400],
                    ['code' => 'dining', 'name' => 'Comedor', 'type' => 'social', 'x' => 400, 'y' => 300],
                    ['code' => 'billiard', 'name' => 'Sala de Billar', 'type' => 'game', 'x' => 500, 'y' => 450],
                    ['code' => 'bedroom', 'name' => 'Dormitorio Principal', 'type' => 'private', 'x' => 200, 'y' => 550],
                ],
                'connections' => [
                    ['from' => 'entrance', 'to' => 'library', 'bidirectional' => true],
                    ['from' => 'entrance', 'to' => 'ballroom', 'bidirectional' => true],
                    ['from' => 'entrance', 'to' => 'dining', 'bidirectional' => true],
                    ['from' => 'library', 'to' => 'study', 'bidirectional' => true],
                    ['from' => 'library', 'to' => 'dining', 'bidirectional' => true],
                    ['from' => 'ballroom', 'to' => 'conservatory', 'bidirectional' => true],
                    ['from' => 'ballroom', 'to' => 'dining', 'bidirectional' => true],
                    ['from' => 'kitchen', 'to' => 'dining', 'bidirectional' => true],
                    ['from' => 'study', 'to' => 'dining', 'bidirectional' => true],
                    ['from' => 'study', 'to' => 'billiard', 'bidirectional' => true],
                    ['from' => 'conservatory', 'to' => 'billiard', 'bidirectional' => true],
                    ['from' => 'kitchen', 'to' => 'bedroom', 'bidirectional' => true],
                    ['from' => 'study', 'to' => 'bedroom', 'bidirectional' => true],
                ],
            ],
        ]);

        // Museum Template
        GameTemplate::create([
            'name' => 'Museo de Historia Natural',
            'type' => 'museum',
            'max_players' => 6,
            'layout_json' => [
                'rooms' => [
                    ['code' => 'lobby', 'name' => 'Vestíbulo', 'type' => 'common', 'x' => 400, 'y' => 100],
                    ['code' => 'dinosaurs', 'name' => 'Sala de Dinosaurios', 'type' => 'exhibit', 'x' => 200, 'y' => 250],
                    ['code' => 'egypt', 'name' => 'Sala Egipcia', 'type' => 'exhibit', 'x' => 600, 'y' => 250],
                    ['code' => 'mammals', 'name' => 'Sala de Mamíferos', 'type' => 'exhibit', 'x' => 100, 'y' => 400],
                    ['code' => 'minerals', 'name' => 'Sala de Minerales', 'type' => 'exhibit', 'x' => 400, 'y' => 400],
                    ['code' => 'ocean', 'name' => 'Sala Oceánica', 'type' => 'exhibit', 'x' => 700, 'y' => 400],
                    ['code' => 'storage', 'name' => 'Almacén', 'type' => 'service', 'x' => 250, 'y' => 550],
                    ['code' => 'lab', 'name' => 'Laboratorio', 'type' => 'service', 'x' => 550, 'y' => 550],
                ],
                'connections' => [
                    ['from' => 'lobby', 'to' => 'dinosaurs', 'bidirectional' => true],
                    ['from' => 'lobby', 'to' => 'egypt', 'bidirectional' => true],
                    ['from' => 'lobby', 'to' => 'minerals', 'bidirectional' => true],
                    ['from' => 'dinosaurs', 'to' => 'mammals', 'bidirectional' => true],
                    ['from' => 'dinosaurs', 'to' => 'minerals', 'bidirectional' => true],
                    ['from' => 'egypt', 'to' => 'ocean', 'bidirectional' => true],
                    ['from' => 'egypt', 'to' => 'minerals', 'bidirectional' => true],
                    ['from' => 'mammals', 'to' => 'storage', 'bidirectional' => true],
                    ['from' => 'minerals', 'to' => 'storage', 'bidirectional' => true],
                    ['from' => 'minerals', 'to' => 'lab', 'bidirectional' => true],
                    ['from' => 'ocean', 'to' => 'lab', 'bidirectional' => true],
                ],
            ],
        ]);

        // Cruise Ship Template
        GameTemplate::create([
            'name' => 'Crucero de Lujo',
            'type' => 'ship',
            'max_players' => 6,
            'layout_json' => [
                'rooms' => [
                    ['code' => 'deck', 'name' => 'Cubierta Principal', 'type' => 'common', 'x' => 400, 'y' => 100],
                    ['code' => 'casino', 'name' => 'Casino', 'type' => 'entertainment', 'x' => 200, 'y' => 250],
                    ['code' => 'theater', 'name' => 'Teatro', 'type' => 'entertainment', 'x' => 600, 'y' => 250],
                    ['code' => 'restaurant', 'name' => 'Restaurante', 'type' => 'dining', 'x' => 400, 'y' => 350],
                    ['code' => 'spa', 'name' => 'Spa', 'type' => 'service', 'x' => 150, 'y' => 450],
                    ['code' => 'pool', 'name' => 'Piscina', 'type' => 'recreation', 'x' => 650, 'y' => 450],
                    ['code' => 'cabin_a', 'name' => 'Camarote A', 'type' => 'private', 'x' => 250, 'y' => 550],
                    ['code' => 'cabin_b', 'name' => 'Camarote B', 'type' => 'private', 'x' => 550, 'y' => 550],
                    ['code' => 'engine', 'name' => 'Sala de Máquinas', 'type' => 'service', 'x' => 400, 'y' => 650],
                ],
                'connections' => [
                    ['from' => 'deck', 'to' => 'casino', 'bidirectional' => true],
                    ['from' => 'deck', 'to' => 'theater', 'bidirectional' => true],
                    ['from' => 'deck', 'to' => 'restaurant', 'bidirectional' => true],
                    ['from' => 'casino', 'to' => 'restaurant', 'bidirectional' => true],
                    ['from' => 'casino', 'to' => 'spa', 'bidirectional' => true],
                    ['from' => 'theater', 'to' => 'restaurant', 'bidirectional' => true],
                    ['from' => 'theater', 'to' => 'pool', 'bidirectional' => true],
                    ['from' => 'restaurant', 'to' => 'spa', 'bidirectional' => true],
                    ['from' => 'restaurant', 'to' => 'pool', 'bidirectional' => true],
                    ['from' => 'spa', 'to' => 'cabin_a', 'bidirectional' => true],
                    ['from' => 'pool', 'to' => 'cabin_b', 'bidirectional' => true],
                    ['from' => 'cabin_a', 'to' => 'engine', 'bidirectional' => true],
                    ['from' => 'cabin_b', 'to' => 'engine', 'bidirectional' => true],
                ],
            ],
        ]);

        $this->command->info('Created 3 game templates');
    }
}

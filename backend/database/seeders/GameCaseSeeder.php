<?php

namespace Database\Seeders;

use App\Models\GameCase;
use Illuminate\Database\Seeder;

class GameCaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cases = [
            [
                'title' => 'El Secreto de la Mansión',
                'description' => 'Lord Blackwood ha sido encontrado muerto en su estudio. La policía cree que fue asesinado durante la fiesta de anoche.',
                'killer_npc_id' => 3,
                'weapon_code' => 'candlestick',
                'room_code' => 'study',
                'motive_text' => 'Venganza por una antigua deuda',
                'difficulty' => 1,
                'meta_json' => [
                    'npcs' => [
                        ['id' => 1, 'name' => 'Mayordomo James', 'role' => 'staff'],
                        ['id' => 2, 'name' => 'Lady Isabella', 'role' => 'family'],
                        ['id' => 3, 'name' => 'Dr. Montgomery', 'role' => 'guest'],
                        ['id' => 4, 'name' => 'Chef Pierre', 'role' => 'staff'],
                    ],
                    'weapons' => [
                        ['code' => 'candlestick', 'name' => 'Candelabro'],
                        ['code' => 'knife', 'name' => 'Cuchillo'],
                        ['code' => 'poison', 'name' => 'Veneno'],
                        ['code' => 'rope', 'name' => 'Cuerda'],
                    ],
                ],
            ],
            [
                'title' => 'El Misterio del Museo',
                'description' => 'Un valioso artefacto egipcio ha sido robado y el guardia nocturno ha sido encontrado inconsciente.',
                'killer_npc_id' => 5,
                'weapon_code' => 'statue',
                'room_code' => 'egypt',
                'motive_text' => 'Robo de antigüedades para el mercado negro',
                'difficulty' => 2,
                'meta_json' => [
                    'npcs' => [
                        ['id' => 5, 'name' => 'Dra. Sarah Cohen', 'role' => 'curator'],
                        ['id' => 6, 'name' => 'Marcus el Guardia', 'role' => 'security'],
                        ['id' => 7, 'name' => 'Prof. Williams', 'role' => 'archaeologist'],
                        ['id' => 8, 'name' => 'Sr. Dubois', 'role' => 'collector'],
                    ],
                    'weapons' => [
                        ['code' => 'statue', 'name' => 'Estatua'],
                        ['code' => 'club', 'name' => 'Porra'],
                        ['code' => 'scepter', 'name' => 'Cetro'],
                        ['code' => 'poison', 'name' => 'Veneno'],
                    ],
                ],
            ],
            [
                'title' => 'Crimen en Alta Mar',
                'description' => 'El millonario pasajero Reginald Thornton ha desaparecido del crucero. Se teme lo peor.',
                'killer_npc_id' => 10,
                'weapon_code' => 'push',
                'room_code' => 'deck',
                'motive_text' => 'Conspiración para heredar la fortuna',
                'difficulty' => 3,
                'meta_json' => [
                    'npcs' => [
                        ['id' => 9, 'name' => 'Capitán Rodriguez', 'role' => 'crew'],
                        ['id' => 10, 'name' => 'Victoria Thornton', 'role' => 'family'],
                        ['id' => 11, 'name' => 'Jack el Camarero', 'role' => 'crew'],
                        ['id' => 12, 'name' => 'Sra. Vanderbilt', 'role' => 'passenger'],
                    ],
                    'weapons' => [
                        ['code' => 'push', 'name' => 'Empujón'],
                        ['code' => 'poison', 'name' => 'Veneno'],
                        ['code' => 'rope', 'name' => 'Cuerda'],
                        ['code' => 'knife', 'name' => 'Cuchillo'],
                    ],
                ],
            ],
            [
                'title' => 'La Herencia Maldita',
                'description' => 'La matriarca de la familia ha sido envenenada durante la lectura del testamento.',
                'killer_npc_id' => 14,
                'weapon_code' => 'poison',
                'room_code' => 'dining',
                'motive_text' => 'Codicia por la herencia familiar',
                'difficulty' => 2,
                'meta_json' => [
                    'npcs' => [
                        ['id' => 13, 'name' => 'Abogado Simmons', 'role' => 'professional'],
                        ['id' => 14, 'name' => 'Sobrino Richard', 'role' => 'family'],
                        ['id' => 15, 'name' => 'Enfermera Helen', 'role' => 'staff'],
                        ['id' => 16, 'name' => 'Sobrina Emma', 'role' => 'family'],
                    ],
                    'weapons' => [
                        ['code' => 'poison', 'name' => 'Veneno'],
                        ['code' => 'injection', 'name' => 'Inyección'],
                        ['code' => 'suffocation', 'name' => 'Asfixia'],
                    ],
                ],
            ],
            [
                'title' => 'El Último Espectáculo',
                'description' => 'El famoso mago ha muerto durante su acto de desaparición. Pero esto no era parte del truco.',
                'killer_npc_id' => 18,
                'weapon_code' => 'blade',
                'room_code' => 'theater',
                'motive_text' => 'Celos profesionales y rivalidad',
                'difficulty' => 3,
                'meta_json' => [
                    'npcs' => [
                        ['id' => 17, 'name' => 'Asistente Luna', 'role' => 'performer'],
                        ['id' => 18, 'name' => 'Rival Mysterio', 'role' => 'performer'],
                        ['id' => 19, 'name' => 'Director del Teatro', 'role' => 'staff'],
                        ['id' => 20, 'name' => 'Tramoyista Joe', 'role' => 'crew'],
                    ],
                    'weapons' => [
                        ['code' => 'blade', 'name' => 'Espada del truco'],
                        ['code' => 'trap', 'name' => 'Trampa mecánica'],
                        ['code' => 'poison', 'name' => 'Veneno'],
                    ],
                ],
            ],
        ];

        foreach ($cases as $caseData) {
            GameCase::create($caseData);
        }

        $this->command->info('Created 5 game cases');
    }
}

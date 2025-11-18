<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Game Configuration
    |--------------------------------------------------------------------------
    */

    'roles' => [
        'detective' => [
            'name' => 'Detective',
            'description' => 'Experto en interrogatorios y deducción',
            'active_ability' => [
                'name' => 'Interrogar',
                'description' => 'Obtiene 2 pistas en vez de 1 al inspeccionar',
                'cooldown' => 3,
            ],
            'passive_ability' => [
                'name' => 'Compartir conocimiento',
                'description' => 'Puede compartir pistas sin coste de acción',
            ],
        ],
        'scientist' => [
            'name' => 'Científico',
            'description' => 'Especialista en análisis forense',
            'active_ability' => [
                'name' => 'Análisis forense',
                'description' => 'Revela un objeto oculto en la habitación',
                'cooldown' => 4,
            ],
            'passive_ability' => [
                'name' => 'Observador',
                'description' => '+1 acción al inspeccionar',
            ],
        ],
        'visionary' => [
            'name' => 'Artista de Visiones',
            'description' => 'Posee habilidades psíquicas',
            'active_ability' => [
                'name' => 'Visión',
                'description' => 'Revelar una habitación sin estar en ella',
                'cooldown' => 5,
            ],
            'passive_ability' => [
                'name' => 'Sexto sentido',
                'description' => 'Ve pistas de habitaciones adyacentes',
            ],
        ],
        'chronicler' => [
            'name' => 'Cronista',
            'description' => 'Registra y analiza eventos',
            'active_ability' => [
                'name' => 'Cronología',
                'description' => 'Ver el orden de eventos pasados en una habitación',
                'cooldown' => 4,
            ],
            'passive_ability' => [
                'name' => 'Registro automático',
                'description' => 'Registra automáticamente movimientos de NPCs',
            ],
        ],
        'infiltrator' => [
            'name' => 'Infiltrado',
            'description' => 'Experto en movimiento furtivo',
            'active_ability' => [
                'name' => 'Camuflaje',
                'description' => 'Moverse 2 veces sin ser detectado',
                'cooldown' => 3,
            ],
            'passive_ability' => [
                'name' => 'Paso silencioso',
                'description' => 'Puede atravesar habitaciones bloqueadas',
            ],
        ],
        'handyman' => [
            'name' => 'Manitas',
            'description' => 'Experto en mecánica y objetos',
            'active_ability' => [
                'name' => 'Reparar/Sabotear',
                'description' => 'Abrir puertas cerradas o bloquear pasillos',
                'cooldown' => 3,
            ],
            'passive_ability' => [
                'name' => 'Uso de herramientas',
                'description' => 'Puede usar objetos del entorno',
            ],
        ],
    ],

    'turn' => [
        'actions_per_turn' => 3,
        'max_turns' => 30,
        'turn_timeout_seconds' => 120,
    ],

    'victory_conditions' => [
        'max_wrong_accusations' => 3,
        'time_limit_turns' => 30,
    ],

];

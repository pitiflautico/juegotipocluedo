import { Injectable, Logger } from '@nestjs/common';

interface GameEvent {
  id: string;
  type: string;
  description: string;
  effect: any;
  probability: number;
}

@Injectable()
export class EventsService {
  private logger = new Logger('EventsService');

  private events: GameEvent[] = [
    {
      id: 'power_outage',
      type: 'environment',
      description: 'Se va la luz. Todos los jugadores deben moverse a habitaciones adyacentes.',
      effect: { type: 'force_move', scope: 'all' },
      probability: 0.1,
    },
    {
      id: 'rumor',
      type: 'social',
      description: 'Un rumor se extiende. Una pista falsa se revela.',
      effect: { type: 'add_false_clue', scope: 'random_room' },
      probability: 0.15,
    },
    {
      id: 'discovery',
      type: 'clue',
      description: 'Se descubre un objeto oculto en una habitación aleatoria.',
      effect: { type: 'reveal_hidden', scope: 'random_room' },
      probability: 0.2,
    },
    {
      id: 'witness',
      type: 'npc',
      description: 'Un testigo aparece y proporciona información.',
      effect: { type: 'add_clue', scope: 'current_room' },
      probability: 0.15,
    },
  ];

  async triggerRandomEvent(): Promise<GameEvent | null> {
    const roll = Math.random();

    for (const event of this.events) {
      if (roll < event.probability) {
        this.logger.log(`Event triggered: ${event.id}`);
        return event;
      }
    }

    return null;
  }

  async processEvent(roomId: string, event: GameEvent): Promise<any> {
    this.logger.log(`Processing event ${event.id} for room ${roomId}`);

    // Event processing logic would go here
    // This would interact with BoardService, PlayerService, etc.

    return {
      eventId: event.id,
      description: event.description,
      effect: event.effect,
    };
  }
}

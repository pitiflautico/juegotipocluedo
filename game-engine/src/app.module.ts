import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { RoomModule } from './room/room.module';
import { PlayerModule } from './player/player.module';
import { BoardModule } from './board/board.module';
import { TurnModule } from './turn/turn.module';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GameModule,
    RoomModule,
    PlayerModule,
    BoardModule,
    TurnModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

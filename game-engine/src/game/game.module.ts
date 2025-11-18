import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { RoomModule } from '../room/room.module';
import { PlayerModule } from '../player/player.module';
import { BoardModule } from '../board/board.module';
import { TurnModule } from '../turn/turn.module';

@Module({
  imports: [RoomModule, PlayerModule, BoardModule, TurnModule],
  providers: [GameGateway, GameService],
  exports: [GameService],
})
export class GameModule {}

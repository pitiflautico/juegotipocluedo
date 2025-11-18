import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { RoomService } from '../room/room.service';
import { PlayerService } from '../player/player.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('GameGateway');

  constructor(
    private readonly gameService: GameService,
    private readonly roomService: RoomService,
    private readonly playerService: PlayerService,
  ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.handlePlayerDisconnect(client);
  }

  @SubscribeMessage('room:create')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<{ success: boolean; data: any } | void> {
    try {
      const room = await this.roomService.createRoom(data);

      client.emit('room:created', {
        success: true,
        data: room,
      });

      return { success: true, data: room };
    } catch (error) {
      this.logger.error(`Error creating room: ${error.message}`);
      client.emit('error', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerInfo: any },
  ) {
    try {
      const { roomId, playerInfo } = data;

      const result = await this.roomService.joinRoom(roomId, playerInfo, client.id);

      // Add client to room
      client.join(roomId);

      // Notify player
      client.emit('room:joined', {
        success: true,
        data: result,
      });

      // Notify others in the room
      client.to(roomId).emit('player:joined', {
        player: result.player,
      });

      // Send current room state
      const roomState = await this.roomService.getRoomState(roomId);
      client.emit('room:state', roomState);

      return { success: true };
    } catch (error) {
      this.logger.error(`Error joining room: ${error.message}`);
      client.emit('error', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      const { roomId } = data;

      await this.roomService.leaveRoom(roomId, client.id);

      client.leave(roomId);

      // Notify others
      client.to(roomId).emit('player:left', {
        socketId: client.id,
      });

      client.emit('room:left', {
        success: true,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error leaving room: ${error.message}`);
    }
  }

  @SubscribeMessage('action:move')
  async handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; targetRoomCode: string },
  ) {
    try {
      const { roomId, targetRoomCode } = data;

      const result = await this.gameService.processMove(roomId, client.id, targetRoomCode);

      // Broadcast to all players in the room
      this.server.to(roomId).emit('game:update', result);

      return { success: true };
    } catch (error) {
      this.logger.error(`Error processing move: ${error.message}`);
      client.emit('error', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('action:inspect')
  async handleInspect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      const { roomId } = data;

      const result = await this.gameService.processInspect(roomId, client.id);

      // Send clues only to the inspecting player
      client.emit('clues:found', result.clues);

      // Broadcast action to all players
      this.server.to(roomId).emit('game:update', {
        action: 'inspect',
        playerId: client.id,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error processing inspect: ${error.message}`);
      client.emit('error', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('action:useAbility')
  async handleUseAbility(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; abilityData?: any },
  ) {
    try {
      const { roomId, abilityData } = data;

      const result = await this.gameService.processAbility(roomId, client.id, abilityData);

      // Broadcast to all players
      this.server.to(roomId).emit('game:update', result);

      return { success: true };
    } catch (error) {
      this.logger.error(`Error using ability: ${error.message}`);
      client.emit('error', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('action:shareClue')
  async handleShareClue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; targetPlayerId: string; clue: any },
  ) {
    try {
      const { roomId, targetPlayerId, clue } = data;

      const result = await this.gameService.processShareClue(
        roomId,
        client.id,
        targetPlayerId,
        clue,
      );

      // Send to target player
      this.server.to(targetPlayerId).emit('clue:received', {
        from: client.id,
        clue: clue,
      });

      // Broadcast action
      this.server.to(roomId).emit('game:update', {
        action: 'share_clue',
        fromPlayerId: client.id,
        toPlayerId: targetPlayerId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error sharing clue: ${error.message}`);
      client.emit('error', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('chat:send')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ) {
    try {
      const { roomId, message } = data;

      // Broadcast to all players in the room
      this.server.to(roomId).emit('chat:message', {
        playerId: client.id,
        message: message,
        timestamp: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error sending chat message: ${error.message}`);
    }
  }

  private async handlePlayerDisconnect(client: Socket) {
    // Find and handle disconnection for all rooms this player was in
    const rooms = await this.playerService.getPlayerRooms(client.id);

    for (const roomId of rooms) {
      await this.roomService.handlePlayerDisconnect(roomId, client.id);

      // Notify others
      client.to(roomId).emit('player:disconnected', {
        playerId: client.id,
      });
    }
  }
}

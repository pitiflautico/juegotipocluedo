import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Room {
  id: string;
  caseId: string;
  templateId: string;
  players: Map<string, any>;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
  maxPlayers: number;
}

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();
  private logger = new Logger('RoomService');

  async createRoom(data: {
    caseId: string;
    templateId: string;
    maxPlayers?: number;
  }): Promise<Room> {
    const roomId = uuidv4();

    const room: Room = {
      id: roomId,
      caseId: data.caseId,
      templateId: data.templateId,
      players: new Map(),
      status: 'waiting',
      createdAt: new Date(),
      maxPlayers: data.maxPlayers || 6,
    };

    this.rooms.set(roomId, room);
    this.logger.log(`Room created: ${roomId}`);

    return room;
  }

  async joinRoom(
    roomId: string,
    playerInfo: any,
    socketId: string,
  ): Promise<{ room: Room; player: any }> {
    const room = this.rooms.get(roomId);

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'waiting') {
      throw new Error('Room is not accepting new players');
    }

    if (room.players.size >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    const player = {
      socketId,
      ...playerInfo,
      joinedAt: new Date(),
    };

    room.players.set(socketId, player);
    this.logger.log(`Player ${socketId} joined room ${roomId}`);

    return { room, player };
  }

  async leaveRoom(roomId: string, socketId: string): Promise<void> {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }

    room.players.delete(socketId);
    this.logger.log(`Player ${socketId} left room ${roomId}`);

    // Clean up empty rooms
    if (room.players.size === 0) {
      this.rooms.delete(roomId);
      this.logger.log(`Room ${roomId} deleted (empty)`);
    }
  }

  async getRoomState(roomId: string): Promise<any> {
    const room = this.rooms.get(roomId);

    if (!room) {
      throw new Error('Room not found');
    }

    return {
      id: room.id,
      status: room.status,
      players: Array.from(room.players.values()),
      playerCount: room.players.size,
      maxPlayers: room.maxPlayers,
    };
  }

  async handlePlayerDisconnect(roomId: string, socketId: string): Promise<void> {
    await this.leaveRoom(roomId, socketId);
  }

  async startGame(roomId: string): Promise<void> {
    const room = this.rooms.get(roomId);

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.players.size < 3) {
      throw new Error('Not enough players to start');
    }

    room.status = 'playing';
    this.logger.log(`Game started in room ${roomId}`);
  }

  getRoomById(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }
}

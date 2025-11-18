import { Injectable, Logger } from '@nestjs/common';

interface Player {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  currentRoom: string;
  clues: any[];
  abilityCooldown: number;
  isConnected: boolean;
}

@Injectable()
export class PlayerService {
  private players: Map<string, Map<string, Player>> = new Map(); // roomId -> (socketId -> Player)
  private logger = new Logger('PlayerService');

  async getPlayer(roomId: string, socketId: string): Promise<Player> {
    const roomPlayers = this.players.get(roomId);

    if (!roomPlayers) {
      throw new Error('Room not found');
    }

    const player = roomPlayers.get(socketId);

    if (!player) {
      throw new Error('Player not found');
    }

    return player;
  }

  async updatePlayerPosition(
    roomId: string,
    socketId: string,
    newRoom: string,
  ): Promise<void> {
    const player = await this.getPlayer(roomId, socketId);
    player.currentRoom = newRoom;
    this.logger.log(`Player ${socketId} moved to ${newRoom}`);
  }

  async addClues(roomId: string, socketId: string, clues: any[]): Promise<void> {
    const player = await this.getPlayer(roomId, socketId);
    player.clues.push(...clues);
    this.logger.log(`Player ${socketId} received ${clues.length} clues`);
  }

  async canUseAbility(roomId: string, socketId: string): Promise<boolean> {
    const player = await this.getPlayer(roomId, socketId);
    return player.abilityCooldown === 0;
  }

  async setAbilityCooldown(roomId: string, socketId: string): Promise<void> {
    const player = await this.getPlayer(roomId, socketId);

    // Set cooldown based on role
    const cooldowns = {
      detective: 3,
      scientist: 4,
      visionary: 5,
      chronicler: 4,
      infiltrator: 3,
      handyman: 3,
    };

    player.abilityCooldown = cooldowns[player.role] || 3;
  }

  async decrementAbilityCooldown(roomId: string, socketId: string): Promise<void> {
    const player = await this.getPlayer(roomId, socketId);

    if (player.abilityCooldown > 0) {
      player.abilityCooldown--;
    }
  }

  async getPlayerRooms(socketId: string): Promise<string[]> {
    const rooms: string[] = [];

    for (const [roomId, roomPlayers] of this.players.entries()) {
      if (roomPlayers.has(socketId)) {
        rooms.push(roomId);
      }
    }

    return rooms;
  }

  async initializePlayer(
    roomId: string,
    socketId: string,
    playerData: {
      userId: string;
      name: string;
      role: string;
      startingRoom: string;
    },
  ): Promise<void> {
    if (!this.players.has(roomId)) {
      this.players.set(roomId, new Map());
    }

    const roomPlayers = this.players.get(roomId)!;

    const player: Player = {
      socketId,
      userId: playerData.userId,
      name: playerData.name,
      role: playerData.role,
      currentRoom: playerData.startingRoom,
      clues: [],
      abilityCooldown: 0,
      isConnected: true,
    };

    roomPlayers.set(socketId, player);
    this.logger.log(`Player initialized: ${socketId} in room ${roomId}`);
  }

  async removePlayer(roomId: string, socketId: string): Promise<void> {
    const roomPlayers = this.players.get(roomId);

    if (roomPlayers) {
      roomPlayers.delete(socketId);

      if (roomPlayers.size === 0) {
        this.players.delete(roomId);
      }
    }
  }
}

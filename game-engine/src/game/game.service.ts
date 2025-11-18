import { Injectable, Logger } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { PlayerService } from '../player/player.service';
import { BoardService } from '../board/board.service';
import { TurnService } from '../turn/turn.service';

@Injectable()
export class GameService {
  private logger = new Logger('GameService');

  constructor(
    private readonly roomService: RoomService,
    private readonly playerService: PlayerService,
    private readonly boardService: BoardService,
    private readonly turnService: TurnService,
  ) {}

  async processMove(roomId: string, socketId: string, targetRoomCode: string) {
    // Validate it's the player's turn
    const isPlayerTurn = await this.turnService.isPlayerTurn(roomId, socketId);
    if (!isPlayerTurn) {
      throw new Error('Not your turn');
    }

    // Validate player has actions left
    const hasActions = await this.turnService.hasActionsLeft(roomId, socketId);
    if (!hasActions) {
      throw new Error('No actions left this turn');
    }

    // Validate move is legal
    const player = await this.playerService.getPlayer(roomId, socketId);
    const canMove = await this.boardService.canMoveTo(
      roomId,
      player.currentRoom,
      targetRoomCode,
    );

    if (!canMove) {
      throw new Error('Invalid move');
    }

    // Execute move
    await this.playerService.updatePlayerPosition(roomId, socketId, targetRoomCode);
    await this.turnService.consumeAction(roomId, socketId);

    this.logger.log(`Player ${socketId} moved to ${targetRoomCode} in room ${roomId}`);

    return {
      action: 'move',
      playerId: socketId,
      targetRoom: targetRoomCode,
      actionsLeft: await this.turnService.getActionsLeft(roomId, socketId),
    };
  }

  async processInspect(roomId: string, socketId: string) {
    // Validate turn and actions
    const isPlayerTurn = await this.turnService.isPlayerTurn(roomId, socketId);
    if (!isPlayerTurn) {
      throw new Error('Not your turn');
    }

    const hasActions = await this.turnService.hasActionsLeft(roomId, socketId);
    if (!hasActions) {
      throw new Error('No actions left this turn');
    }

    // Get clues from current room
    const player = await this.playerService.getPlayer(roomId, socketId);
    const clues = await this.boardService.getCluesInRoom(
      roomId,
      player.currentRoom,
      player.role,
    );

    // Consume action
    await this.turnService.consumeAction(roomId, socketId);

    // Add clues to player's collection
    await this.playerService.addClues(roomId, socketId, clues);

    this.logger.log(`Player ${socketId} inspected room ${player.currentRoom}`);

    return {
      clues,
      actionsLeft: await this.turnService.getActionsLeft(roomId, socketId),
    };
  }

  async processAbility(roomId: string, socketId: string, abilityData: any) {
    // Validate turn and actions
    const isPlayerTurn = await this.turnService.isPlayerTurn(roomId, socketId);
    if (!isPlayerTurn) {
      throw new Error('Not your turn');
    }

    const hasActions = await this.turnService.hasActionsLeft(roomId, socketId);
    if (!hasActions) {
      throw new Error('No actions left this turn');
    }

    // Check ability cooldown
    const player = await this.playerService.getPlayer(roomId, socketId);
    const canUseAbility = await this.playerService.canUseAbility(roomId, socketId);
    if (!canUseAbility) {
      throw new Error('Ability on cooldown');
    }

    // Process ability based on role
    const result = await this.processRoleAbility(
      roomId,
      socketId,
      player.role,
      abilityData,
    );

    // Consume action and set cooldown
    await this.turnService.consumeAction(roomId, socketId);
    await this.playerService.setAbilityCooldown(roomId, socketId);

    this.logger.log(`Player ${socketId} used ability: ${player.role}`);

    return result;
  }

  async processShareClue(
    roomId: string,
    fromSocketId: string,
    toSocketId: string,
    clue: any,
  ) {
    // Validate turn
    const isPlayerTurn = await this.turnService.isPlayerTurn(roomId, fromSocketId);
    if (!isPlayerTurn) {
      throw new Error('Not your turn');
    }

    // Check if detective (doesn't consume action) or needs to consume action
    const player = await this.playerService.getPlayer(roomId, fromSocketId);

    if (player.role !== 'detective') {
      const hasActions = await this.turnService.hasActionsLeft(roomId, fromSocketId);
      if (!hasActions) {
        throw new Error('No actions left this turn');
      }
      await this.turnService.consumeAction(roomId, fromSocketId);
    }

    // Transfer clue
    await this.playerService.addClues(roomId, toSocketId, [clue]);

    this.logger.log(`Player ${fromSocketId} shared clue with ${toSocketId}`);

    return {
      success: true,
    };
  }

  private async processRoleAbility(
    roomId: string,
    socketId: string,
    role: string,
    abilityData: any,
  ) {
    // This will be implemented with specific logic for each role
    switch (role) {
      case 'detective':
        return await this.processDetectiveAbility(roomId, socketId, abilityData);
      case 'scientist':
        return await this.processScientistAbility(roomId, socketId, abilityData);
      case 'visionary':
        return await this.processVisionaryAbility(roomId, socketId, abilityData);
      case 'chronicler':
        return await this.processChroniclerAbility(roomId, socketId, abilityData);
      case 'infiltrator':
        return await this.processInfiltratorAbility(roomId, socketId, abilityData);
      case 'handyman':
        return await this.processHandymanAbility(roomId, socketId, abilityData);
      default:
        throw new Error('Unknown role');
    }
  }

  // Role-specific ability implementations
  private async processDetectiveAbility(roomId: string, socketId: string, data: any) {
    // Detective: Interrogate - gets 2 clues instead of 1
    const player = await this.playerService.getPlayer(roomId, socketId);
    const clues = await this.boardService.getCluesInRoom(
      roomId,
      player.currentRoom,
      player.role,
      2, // Get 2 clues
    );

    await this.playerService.addClues(roomId, socketId, clues);

    return {
      action: 'detective_interrogate',
      clues,
    };
  }

  private async processScientistAbility(roomId: string, socketId: string, data: any) {
    // Scientist: Forensic Analysis - reveal hidden object
    const player = await this.playerService.getPlayer(roomId, socketId);
    const hiddenObject = await this.boardService.revealHiddenObject(
      roomId,
      player.currentRoom,
    );

    return {
      action: 'scientist_analyze',
      hiddenObject,
    };
  }

  private async processVisionaryAbility(roomId: string, socketId: string, data: any) {
    // Visionary: Vision - reveal a room without being there
    const { targetRoomCode } = data;
    const clues = await this.boardService.getCluesInRoom(
      roomId,
      targetRoomCode,
      'visionary',
    );

    await this.playerService.addClues(roomId, socketId, clues);

    return {
      action: 'visionary_vision',
      targetRoom: targetRoomCode,
      clues,
    };
  }

  private async processChroniclerAbility(roomId: string, socketId: string, data: any) {
    // Chronicler: Timeline - see past events in a room
    const player = await this.playerService.getPlayer(roomId, socketId);
    const events = await this.boardService.getRoomHistory(
      roomId,
      player.currentRoom,
    );

    return {
      action: 'chronicler_timeline',
      events,
    };
  }

  private async processInfiltratorAbility(roomId: string, socketId: string, data: any) {
    // Infiltrator: Camouflage - move twice without being detected
    return {
      action: 'infiltrator_camouflage',
      extraMoves: 2,
    };
  }

  private async processHandymanAbility(roomId: string, socketId: string, data: any) {
    // Handyman: Repair/Sabotage - open locked doors
    const { targetDoorCode } = data;
    await this.boardService.unlockDoor(roomId, targetDoorCode);

    return {
      action: 'handyman_unlock',
      door: targetDoorCode,
    };
  }
}

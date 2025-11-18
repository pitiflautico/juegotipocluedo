import { Injectable, Logger } from '@nestjs/common';

interface TurnState {
  currentPlayerSocketId: string;
  actionsRemaining: number;
  turnNumber: number;
  playerOrder: string[];
  maxTurns: number;
}

@Injectable()
export class TurnService {
  private turns: Map<string, TurnState> = new Map(); // roomId -> TurnState
  private logger = new Logger('TurnService');

  async initializeTurns(
    roomId: string,
    playerSocketIds: string[],
    maxTurns: number = 30,
  ): Promise<void> {
    const turnState: TurnState = {
      currentPlayerSocketId: playerSocketIds[0],
      actionsRemaining: 3,
      turnNumber: 1,
      playerOrder: playerSocketIds,
      maxTurns,
    };

    this.turns.set(roomId, turnState);
    this.logger.log(`Turns initialized for room ${roomId}`);
  }

  async isPlayerTurn(roomId: string, socketId: string): Promise<boolean> {
    const turnState = this.turns.get(roomId);

    if (!turnState) {
      return false;
    }

    return turnState.currentPlayerSocketId === socketId;
  }

  async hasActionsLeft(roomId: string, socketId: string): Promise<boolean> {
    const turnState = this.turns.get(roomId);

    if (!turnState) {
      return false;
    }

    if (turnState.currentPlayerSocketId !== socketId) {
      return false;
    }

    return turnState.actionsRemaining > 0;
  }

  async consumeAction(roomId: string, socketId: string): Promise<void> {
    const turnState = this.turns.get(roomId);

    if (!turnState) {
      throw new Error('Turn state not found');
    }

    if (turnState.currentPlayerSocketId !== socketId) {
      throw new Error('Not your turn');
    }

    if (turnState.actionsRemaining <= 0) {
      throw new Error('No actions remaining');
    }

    turnState.actionsRemaining--;
    this.logger.log(
      `Player ${socketId} consumed action. Remaining: ${turnState.actionsRemaining}`,
    );

    // Auto-end turn if no actions left
    if (turnState.actionsRemaining === 0) {
      await this.nextTurn(roomId);
    }
  }

  async getActionsLeft(roomId: string, socketId: string): Promise<number> {
    const turnState = this.turns.get(roomId);

    if (!turnState || turnState.currentPlayerSocketId !== socketId) {
      return 0;
    }

    return turnState.actionsRemaining;
  }

  async nextTurn(roomId: string): Promise<{ nextPlayer: string; turnNumber: number }> {
    const turnState = this.turns.get(roomId);

    if (!turnState) {
      throw new Error('Turn state not found');
    }

    // Find next player
    const currentIndex = turnState.playerOrder.indexOf(turnState.currentPlayerSocketId);
    const nextIndex = (currentIndex + 1) % turnState.playerOrder.length;

    // If we've cycled back to the first player, increment turn number
    if (nextIndex === 0) {
      turnState.turnNumber++;
    }

    turnState.currentPlayerSocketId = turnState.playerOrder[nextIndex];
    turnState.actionsRemaining = 3;

    this.logger.log(
      `Turn ${turnState.turnNumber}: Now it's ${turnState.currentPlayerSocketId}'s turn`,
    );

    return {
      nextPlayer: turnState.currentPlayerSocketId,
      turnNumber: turnState.turnNumber,
    };
  }

  async getCurrentTurn(roomId: string): Promise<TurnState | null> {
    return this.turns.get(roomId) || null;
  }

  async isGameOver(roomId: string): Promise<boolean> {
    const turnState = this.turns.get(roomId);

    if (!turnState) {
      return false;
    }

    return turnState.turnNumber > turnState.maxTurns;
  }
}

import { Injectable, Logger } from '@nestjs/common';

interface BoardState {
  layout: any;
  rooms: Map<string, RoomData>;
  connections: Map<string, string[]>;
  clues: Map<string, any[]>;
}

interface RoomData {
  code: string;
  name: string;
  type: string;
  isLocked: boolean;
  hiddenObjects: any[];
  history: any[];
}

@Injectable()
export class BoardService {
  private boards: Map<string, BoardState> = new Map(); // roomId -> BoardState
  private logger = new Logger('BoardService');

  async initializeBoard(
    roomId: string,
    templateData: any,
    caseData: any,
  ): Promise<void> {
    const boardState: BoardState = {
      layout: templateData.layout,
      rooms: new Map(),
      connections: new Map(),
      clues: new Map(),
    };

    // Initialize rooms from template
    for (const room of templateData.layout.rooms) {
      const roomData: RoomData = {
        code: room.code,
        name: room.name,
        type: room.type,
        isLocked: room.isLocked || false,
        hiddenObjects: [],
        history: [],
      };

      boardState.rooms.set(room.code, roomData);
    }

    // Initialize connections
    for (const connection of templateData.layout.connections) {
      const { from, to } = connection;

      if (!boardState.connections.has(from)) {
        boardState.connections.set(from, []);
      }

      boardState.connections.get(from)!.push(to);

      // Add reverse connection if bidirectional
      if (connection.bidirectional !== false) {
        if (!boardState.connections.has(to)) {
          boardState.connections.set(to, []);
        }
        boardState.connections.get(to)!.push(from);
      }
    }

    // Distribute clues based on case
    this.distributeClues(boardState, caseData);

    this.boards.set(roomId, boardState);
    this.logger.log(`Board initialized for room ${roomId}`);
  }

  async canMoveTo(
    roomId: string,
    currentRoom: string,
    targetRoom: string,
  ): Promise<boolean> {
    const board = this.boards.get(roomId);

    if (!board) {
      return false;
    }

    const connections = board.connections.get(currentRoom);

    if (!connections || !connections.includes(targetRoom)) {
      return false;
    }

    const targetRoomData = board.rooms.get(targetRoom);

    if (targetRoomData && targetRoomData.isLocked) {
      return false;
    }

    return true;
  }

  async getCluesInRoom(
    roomId: string,
    roomCode: string,
    role: string,
    count: number = 1,
  ): Promise<any[]> {
    const board = this.boards.get(roomId);

    if (!board) {
      return [];
    }

    const roomClues = board.clues.get(roomCode) || [];

    // Return random clues up to the count
    const shuffled = roomClues.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async revealHiddenObject(roomId: string, roomCode: string): Promise<any> {
    const board = this.boards.get(roomId);

    if (!board) {
      return null;
    }

    const room = board.rooms.get(roomCode);

    if (!room || room.hiddenObjects.length === 0) {
      return null;
    }

    const hiddenObject = room.hiddenObjects.pop();
    this.logger.log(`Hidden object revealed in room ${roomCode}`);

    return hiddenObject;
  }

  async getRoomHistory(roomId: string, roomCode: string): Promise<any[]> {
    const board = this.boards.get(roomId);

    if (!board) {
      return [];
    }

    const room = board.rooms.get(roomCode);

    if (!room) {
      return [];
    }

    return room.history;
  }

  async unlockDoor(roomId: string, doorCode: string): Promise<void> {
    const board = this.boards.get(roomId);

    if (!board) {
      throw new Error('Board not found');
    }

    const room = board.rooms.get(doorCode);

    if (room) {
      room.isLocked = false;
      this.logger.log(`Door ${doorCode} unlocked`);
    }
  }

  async addRoomHistory(
    roomId: string,
    roomCode: string,
    event: any,
  ): Promise<void> {
    const board = this.boards.get(roomId);

    if (!board) {
      return;
    }

    const room = board.rooms.get(roomCode);

    if (room) {
      room.history.push({
        ...event,
        timestamp: new Date(),
      });
    }
  }

  private distributeClues(boardState: BoardState, caseData: any): void {
    // This would be more sophisticated in a real implementation
    // For now, just distribute clues randomly across rooms

    const allRoomCodes = Array.from(boardState.rooms.keys());
    const numberOfClues = 20; // Total clues to distribute

    for (let i = 0; i < numberOfClues; i++) {
      const randomRoom = allRoomCodes[Math.floor(Math.random() * allRoomCodes.length)];

      if (!boardState.clues.has(randomRoom)) {
        boardState.clues.set(randomRoom, []);
      }

      const clue = {
        id: `clue_${i}`,
        type: Math.random() > 0.8 ? 'false' : 'true',
        description: `Clue ${i}`,
        relatedTo: ['weapon', 'suspect', 'room', 'motive'][Math.floor(Math.random() * 4)],
      };

      boardState.clues.get(randomRoom)!.push(clue);
    }
  }
}

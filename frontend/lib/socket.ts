import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to game server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from game server');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    this.socket?.on(event, callback as any);
  }

  off(event: string, callback?: Function) {
    if (callback) {
      this.socket?.off(event, callback as any);
      const listeners = this.listeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      this.socket?.off(event);
      this.listeners.delete(event);
    }
  }

  emit(event: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit(event, data, (response: any) => {
        if (response?.success === false) {
          reject(new Error(response.message || 'Request failed'));
        } else {
          resolve(response);
        }
      });
    });
  }

  // Room methods
  async createRoom(data: { caseId: string; templateId: string; maxPlayers?: number }) {
    return this.emit('room:create', data);
  }

  async joinRoom(roomId: string, playerInfo: any) {
    return this.emit('room:join', { roomId, playerInfo });
  }

  async leaveRoom(roomId: string) {
    return this.emit('room:leave', { roomId });
  }

  // Action methods
  async move(roomId: string, targetRoomCode: string) {
    return this.emit('action:move', { roomId, targetRoomCode });
  }

  async inspect(roomId: string) {
    return this.emit('action:inspect', { roomId });
  }

  async useAbility(roomId: string, abilityData?: any) {
    return this.emit('action:useAbility', { roomId, abilityData });
  }

  async shareClue(roomId: string, targetPlayerId: string, clue: any) {
    return this.emit('action:shareClue', { roomId, targetPlayerId, clue });
  }

  // Chat methods
  async sendChatMessage(roomId: string, message: string) {
    return this.emit('chat:send', { roomId, message });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socket = new SocketClient();

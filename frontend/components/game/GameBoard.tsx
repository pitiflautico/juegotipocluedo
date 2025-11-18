'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

interface Room {
  code: string;
  name: string;
  type: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

interface GameBoardProps {
  layout: {
    rooms: Room[];
    connections: Connection[];
  };
  players: any[];
  currentPlayer?: string;
  onRoomClick?: (roomCode: string) => void;
}

export function GameBoard({ layout, players, currentPlayer, onRoomClick }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !layout) return;

    // Initialize PixiJS
    const app = new PIXI.Application({
      width: 800,
      height: 700,
      backgroundColor: 0x1a1a2e,
      antialias: true,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Draw connections first (so they appear behind rooms)
    const connectionsContainer = new PIXI.Container();
    app.stage.addChild(connectionsContainer);

    layout.connections.forEach((conn) => {
      const fromRoom = layout.rooms.find(r => r.code === conn.from);
      const toRoom = layout.rooms.find(r => r.code === conn.to);

      if (fromRoom && toRoom) {
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0x533483, 0.5);
        line.moveTo(fromRoom.x, fromRoom.y);
        line.lineTo(toRoom.x, toRoom.y);
        connectionsContainer.addChild(line);
      }
    });

    // Draw rooms
    const roomsContainer = new PIXI.Container();
    app.stage.addChild(roomsContainer);

    const roomGraphics = new Map<string, PIXI.Container>();

    layout.rooms.forEach((room) => {
      const roomContainer = new PIXI.Container();
      roomContainer.x = room.x;
      roomContainer.y = room.y;
      roomContainer.interactive = true;
      roomContainer.cursor = 'pointer';

      // Room circle
      const circle = new PIXI.Graphics();
      const roomColor = getRoomColor(room.type);
      circle.beginFill(roomColor, 0.8);
      circle.lineStyle(3, 0xffffff, 0.3);
      circle.drawCircle(0, 0, 40);
      circle.endFill();
      roomContainer.addChild(circle);

      // Room name
      const text = new PIXI.Text(room.name, {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 0xffffff,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 70,
      });
      text.anchor.set(0.5);
      text.y = 55;
      roomContainer.addChild(text);

      // Hover effects
      roomContainer.on('pointerover', () => {
        circle.clear();
        circle.beginFill(roomColor, 1);
        circle.lineStyle(4, 0xffffff, 0.8);
        circle.drawCircle(0, 0, 45);
        circle.endFill();
      });

      roomContainer.on('pointerout', () => {
        if (selectedRoom !== room.code) {
          circle.clear();
          circle.beginFill(roomColor, 0.8);
          circle.lineStyle(3, 0xffffff, 0.3);
          circle.drawCircle(0, 0, 40);
          circle.endFill();
        }
      });

      // Click handler
      roomContainer.on('pointertap', () => {
        setSelectedRoom(room.code);
        if (onRoomClick) {
          onRoomClick(room.code);
        }
      });

      roomsContainer.addChild(roomContainer);
      roomGraphics.set(room.code, roomContainer);
    });

    // Draw players
    const playersContainer = new PIXI.Container();
    app.stage.addChild(playersContainer);

    // Cleanup
    return () => {
      app.destroy(true, { children: true });
    };
  }, [layout]);

  // Update players positions
  useEffect(() => {
    if (!appRef.current || !players) return;

    const playersContainer = appRef.current.stage.children[2] as PIXI.Container;
    if (playersContainer) {
      playersContainer.removeChildren();

      players.forEach((player, index) => {
        const room = layout.rooms.find(r => r.code === player.currentRoom);
        if (!room) return;

        const playerGraphic = new PIXI.Graphics();
        const isCurrentPlayer = player.socketId === currentPlayer;

        playerGraphic.beginFill(isCurrentPlayer ? 0x0ea5e9 : 0x22c55e);
        playerGraphic.drawCircle(0, 0, 8);
        playerGraphic.endFill();

        // Position around the room
        const angle = (index * 2 * Math.PI) / players.length;
        playerGraphic.x = room.x + Math.cos(angle) * 25;
        playerGraphic.y = room.y + Math.sin(angle) * 25;

        playersContainer.addChild(playerGraphic);
      });
    }
  }, [players, currentPlayer, layout]);

  function getRoomColor(type: string): number {
    const colors: Record<string, number> = {
      common: 0x0369a1,
      study: 0x7c3aed,
      social: 0xdb2777,
      private: 0xdc2626,
      service: 0x65a30d,
      garden: 0x059669,
      game: 0xf59e0b,
      exhibit: 0x8b5cf6,
      entertainment: 0xec4899,
      dining: 0xf97316,
      recreation: 0x06b6d4,
    };
    return colors[type] || 0x475569;
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="rounded-lg overflow-hidden border-2 border-white/10 shadow-2xl"
      />
      {selectedRoom && (
        <div className="absolute top-4 left-4 bg-mystery-dark/90 backdrop-blur-lg px-4 py-2 rounded-lg border border-white/20">
          <p className="text-white text-sm">
            Habitación seleccionada: <span className="font-bold">{selectedRoom}</span>
          </p>
        </div>
      )}
    </div>
  );
}

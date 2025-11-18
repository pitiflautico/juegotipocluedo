'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface PlayerHUDProps {
  turnNumber: number;
  currentPlayerName: string;
  actionsRemaining: number;
  isMyTurn: boolean;
}

export function PlayerHUD({ turnNumber, currentPlayerName, actionsRemaining, isMyTurn }: PlayerHUDProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Turno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-mystery-accent">#{turnNumber}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Jugador Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-white truncate">{currentPlayerName}</div>
          {isMyTurn && (
            <div className="text-xs text-green-400 mt-1">¡Tu turno!</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Acciones Restantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 ${
                  i < actionsRemaining
                    ? 'bg-green-500 border-green-400'
                    : 'bg-gray-600 border-gray-500'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ActionsPanelProps {
  canAct: boolean;
  actionsRemaining: number;
  onMove: () => void;
  onInspect: () => void;
  onAccuse: () => void;
}

export function ActionsPanel({
  canAct,
  actionsRemaining,
  onMove,
  onInspect,
  onAccuse,
}: ActionsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            onClick={onMove}
            disabled={!canAct || actionsRemaining === 0}
            className="w-full"
            size="lg"
          >
            🚶 Mover
          </Button>

          <Button
            onClick={onInspect}
            disabled={!canAct || actionsRemaining === 0}
            className="w-full"
            variant="secondary"
            size="lg"
          >
            🔍 Inspeccionar
          </Button>

          <Button
            onClick={onAccuse}
            disabled={!canAct}
            className="w-full"
            variant="danger"
            size="lg"
          >
            ⚖️ Hacer Acusación
          </Button>

          {!canAct && (
            <p className="text-sm text-gray-400 text-center">
              Espera tu turno para actuar
            </p>
          )}

          {canAct && actionsRemaining === 0 && (
            <p className="text-sm text-yellow-400 text-center">
              No te quedan acciones este turno
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

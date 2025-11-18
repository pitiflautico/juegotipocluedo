'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Role {
  code: string;
  name: string;
  active_ability: {
    name: string;
    description: string;
    cooldown: number;
  };
  passive_ability: {
    name: string;
    description: string;
  };
}

interface AbilitiesPanelProps {
  role: Role;
  abilityCooldown: number;
  onUseAbility: () => void;
  canUseAbility: boolean;
}

const ROLE_ICONS: Record<string, string> = {
  detective: '🔍',
  scientist: '🔬',
  visionary: '🔮',
  chronicler: '📚',
  infiltrator: '🥷',
  handyman: '🔧',
};

export function AbilitiesPanel({ role, abilityCooldown, onUseAbility, canUseAbility }: AbilitiesPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="text-4xl">{ROLE_ICONS[role.code] || '🎭'}</div>
          <div>
            <CardTitle>{role.name}</CardTitle>
            <p className="text-xs text-gray-400">Tu rol en esta partida</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Ability */}
          <div className="p-4 bg-mystery-accent/20 rounded-lg border border-mystery-accent/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">Habilidad Activa</h4>
              {abilityCooldown > 0 && (
                <span className="text-xs px-2 py-1 bg-red-500/20 rounded text-red-400">
                  Cooldown: {abilityCooldown} turnos
                </span>
              )}
            </div>
            <p className="text-lg font-bold text-mystery-accent mb-2">
              {role.active_ability.name}
            </p>
            <p className="text-sm text-gray-300 mb-3">
              {role.active_ability.description}
            </p>
            <Button
              size="sm"
              onClick={onUseAbility}
              disabled={!canUseAbility || abilityCooldown > 0}
              className="w-full"
            >
              {abilityCooldown > 0 ? `Recargando (${abilityCooldown})` : 'Usar Habilidad'}
            </Button>
          </div>

          {/* Passive Ability */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Habilidad Pasiva</h4>
            <p className="text-lg font-bold text-blue-400 mb-2">
              {role.passive_ability.name}
            </p>
            <p className="text-sm text-gray-300">
              {role.passive_ability.description}
            </p>
          </div>

          {/* Cooldown info */}
          <div className="text-xs text-gray-400 text-center">
            Cooldown: {role.active_ability.cooldown} turnos después de usar
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

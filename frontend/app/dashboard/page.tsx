'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadGames();
  }, [isAuthenticated]);

  const loadGames = async () => {
    try {
      const response = await api.getGames();
      setGames(response.data?.data || []);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light flex items-center justify-center">
      <div className="text-white text-xl">Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light">
      {/* Header */}
      <header className="bg-mystery-dark/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Club Misterium</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">Hola, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Partidas Jugadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-mystery-accent">
                {user.stats?.games_played || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Victorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-400">
                {user.stats?.games_won || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasa de Victoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-400">
                {user.stats?.win_rate || 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card hover onClick={() => router.push('/lobby')}>
            <CardHeader>
              <div className="text-6xl mb-4">🎮</div>
              <CardTitle>Jugar Ahora</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Únete a una partida o crea una nueva sala</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-6xl mb-4">📚</div>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Revisa tus partidas anteriores</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle>Partidas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-400">Cargando partidas...</p>
            ) : games.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Aún no has jugado ninguna partida</p>
                <Link href="/lobby">
                  <Button>Jugar Ahora</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {games.slice(0, 5).map((game: any) => (
                  <div
                    key={game.id}
                    className="flex justify-between items-center p-4 bg-white/5 rounded-lg"
                  >
                    <div>
                      <h4 className="text-white font-semibold">{game.game_case?.title}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(game.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        game.status === 'finished' ? 'bg-green-500/20 text-green-400' :
                        game.status === 'playing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {game.status === 'finished' ? 'Finalizada' :
                         game.status === 'playing' ? 'En curso' : 'Esperando'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

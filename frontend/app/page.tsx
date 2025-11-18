'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            CLUB MISTERIUM
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Un juego de misterio cooperativo donde la deducción y el trabajo en equipo son clave
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Roles Asimétricos</h3>
            <p className="text-gray-300">
              Cada jugador tiene habilidades únicas: Detective, Científico, Visionario y más.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold mb-2">Misterios Rejugables</h3>
            <p className="text-gray-300">
              Casos variados con elementos aleatorios que garantizan una experiencia única cada vez.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Cooperativo</h3>
            <p className="text-gray-300">
              Trabaja en equipo para resolver el misterio antes de que se acabe el tiempo.
            </p>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Link
            href="/register"
            className="inline-block bg-mystery-accent hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Crear Cuenta
          </Link>
          <Link
            href="/login"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>

        <div className="mt-16 bg-white/5 backdrop-blur-lg rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">¿Cómo se juega?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2">1. Elige tu Rol</h3>
              <p className="text-gray-300">
                Cada rol tiene habilidades especiales que te ayudarán a descubrir pistas únicas.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">2. Explora el Tablero</h3>
              <p className="text-gray-300">
                Muévete por las habitaciones buscando pistas sobre el culpable, el arma y el motivo.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">3. Comparte Información</h3>
              <p className="text-gray-300">
                Colabora con tus compañeros compartiendo pistas y deduciendo juntos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">4. Resuelve el Misterio</h3>
              <p className="text-gray-300">
                Antes de que se acabe el tiempo, haz tu acusación final y resuelve el caso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

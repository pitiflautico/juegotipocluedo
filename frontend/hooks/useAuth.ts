'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    check();
  }, [checkAuth]);

  const requireAuth = () => {
    if (!isChecking && !isAuthenticated) {
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isChecking,
    requireAuth,
  };
}

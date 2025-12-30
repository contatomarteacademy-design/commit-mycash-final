'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/app/dashboard-layout';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isLoginPage = pathname === '/login';
      
      if (!user && !isLoginPage) {
        router.push('/login');
      } else if (user && isLoginPage) {
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se está na página de login, mostrar apenas o children (sem DashboardLayout)
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Se não está autenticado e não é login, não renderizar nada (será redirecionado)
  if (!user) {
    return null;
  }

  // Se está autenticado, mostrar o dashboard
  return <DashboardLayout>{children}</DashboardLayout>;
}


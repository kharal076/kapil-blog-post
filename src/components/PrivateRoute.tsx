'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // or loading spinner

  return <>{children}</>;
};

export default PrivateRoute;

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function RedirectToHome() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);

  return null;
}

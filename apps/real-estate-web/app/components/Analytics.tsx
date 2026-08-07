'use client';

import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Client error:', event.message);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return null;
}

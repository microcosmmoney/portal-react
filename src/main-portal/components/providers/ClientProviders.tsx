// AI-generated · AI-managed · AI-maintained
'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { SolanaWalletProvider } from './SolanaWalletProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SolanaWalletProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            border: '1px solid #333',
            color: '#fff',
          },
        }}
      />
    </SolanaWalletProvider>
  );
}

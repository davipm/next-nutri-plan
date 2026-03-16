'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { GlobalAlertDialog } from '@/components/global-alert-dialog';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/orpc';
import { ThemeProvider } from '@/providers/theme-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <GlobalAlertDialog />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}

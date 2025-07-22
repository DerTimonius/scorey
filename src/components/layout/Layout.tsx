import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { Navbar } from './Navbar';

export function Layout({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <>
      <Navbar />
      <main
        className={cn(
          'flex h-screen flex-col items-center justify-center gap-18 overflow-scroll font-sans',
          className,
        )}
      >
        {children}
      </main>
    </>
  );
}

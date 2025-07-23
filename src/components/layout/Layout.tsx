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
          'flex min-h-[90svh] flex-col items-center justify-center gap-12 overflow-scroll font-sans md:gap-18',
          className,
        )}
      >
        {children}
      </main>
    </>
  );
}

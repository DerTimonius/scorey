import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { DEFAULT_COLOR } from '@/lib/constants';
import type { VariantColor } from '@/lib/types';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-base whitespace-nowrap text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      color: {
        red: 'bg-red-background',
        orange: 'bg-orange-background',
        amber: 'bg-amber-background',
        yellow: 'bg-yellow-background',
        lime: 'bg-lime-background',
        green: 'bg-green-background',
        emerald: 'bg-emerald-background',
        teal: 'bg-teal-background',
        cyan: 'bg-cyan-background',
        sky: 'bg-sky-background',
        blue: 'bg-blue-background',
        indigo: 'bg-indigo-background',
        violet: 'bg-violet-background',
        purple: 'bg-purple-background',
        fuchsia: 'bg-fuchsia-background',
        pink: 'bg-pink-background',
        rose: 'bg-rose-background',
      } satisfies VariantColor,
    },
    defaultVariants: {
      color: DEFAULT_COLOR,
    },
  },
);

function Badge({
  className,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';

  return <Comp data-slot="badge" className={cn(badgeVariants({ color }), className)} {...props} />;
}

export { Badge, badgeVariants };

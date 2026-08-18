import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { DEFAULT_COLOR } from '@/lib/constants';
import type { VariantColor } from '@/lib/types';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-base font-base whitespace-nowrap text-black ring-offset-white transition-all focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        ghost: 'border-2 border-border',
        secondary:
          'border-2 border-border !bg-white shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        tertiary: 'border-2 border-border !bg-white',
      },
      color: {
        red: 'bg-red-main',
        orange: 'bg-orange-main',
        amber: 'bg-amber-main',
        yellow: 'bg-yellow-main',
        lime: 'bg-lime-main',
        green: 'bg-green-main',
        emerald: 'bg-emerald-main',
        teal: 'bg-teal-main',
        cyan: 'bg-cyan-main',
        sky: 'bg-sky-main',
        blue: 'bg-blue-main',
        indigo: 'bg-indigo-main',
        violet: 'bg-violet-main',
        purple: 'bg-purple-main',
        fuchsia: 'bg-fuchsia-main',
        pink: 'bg-pink-main',
        rose: 'bg-rose-main',
      } satisfies VariantColor,
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      color: DEFAULT_COLOR,
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  color,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };

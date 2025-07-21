import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { DEFAULT_COLOR } from '@/lib/constants';
import type { VariantColor } from '@/lib/types';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'flex flex-col gap-6 rounded-base border-2 border-border py-6 font-base text-foreground shadow-shadow',
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

function Card({
  className,
  color,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ color }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-heading leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('font-base text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
};

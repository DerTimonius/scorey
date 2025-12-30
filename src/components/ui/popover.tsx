import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { DEFAULT_COLOR } from '@/lib/constants';
import type { VariantColor } from '@/lib/types';
import { cn } from '@/lib/utils';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

const popoverVariants = cva(
  'z-50 w-72 rounded-base border-2 border-border p-4 text-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)',
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

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  color,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> &
  VariantProps<typeof popoverVariants>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(popoverVariants({ color }), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent };

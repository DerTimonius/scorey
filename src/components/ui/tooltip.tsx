import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { DEFAULT_COLOR } from '@/lib/constants';
import type { VariantColor } from '@/lib/types';
import { cn } from '@/lib/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const tooltipVariants = cva(
  'z-50 overflow-hidden rounded-base border-2 border-border px-3 py-1.5 text-sm font-base text-main-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)',
  {
    variants: {
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
    },
    defaultVariants: {
      color: DEFAULT_COLOR,
    },
  },
);

function TooltipContent({
  className,
  sideOffset = 4,
  color,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipVariants>) {
  return (
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(tooltipVariants({ color }), className)}
      {...props}
    />
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

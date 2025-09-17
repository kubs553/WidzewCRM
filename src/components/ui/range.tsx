"use client"

import * as React from "react"
import * as RangePrimitive from "@radix-ui/react-range"

import { cn } from "@/lib/utils"

const Range = React.forwardRef<
  React.ElementRef<typeof RangePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RangePrimitive.Root>
>(({ className, ...props }, ref) => (
  <RangePrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <RangePrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <RangePrimitive.Range className="absolute h-full bg-primary" />
    </RangePrimitive.Track>
    <RangePrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </RangePrimitive.Root>
))
Range.displayName = RangePrimitive.Root.displayName

export { Range }

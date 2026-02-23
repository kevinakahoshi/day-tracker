import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

export const Tooltip = TooltipPrimitive.Root
export function TooltipProvider({ children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider delayDuration={0} {...props}>
      {children}
    </TooltipPrimitive.Provider>
  )
}
export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent({
  children,
  className = '',
  side = 'top',
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { className?: string }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side as any}
        align="center"
        sideOffset={6}
        className={`z-50 rounded-md bg-gray-800 px-2 py-1 text-white text-xs shadow-lg ${className}`}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-gray-800" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export default TooltipPrimitive

'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import styled from 'styled-components'

const StyledTooltipContent = styled(TooltipPrimitive.Content)`
  background-color: var(--foreground);
  color: var(--background);
  z-index: 50;
  width: fit-content;
  border-radius: var(--radius-md);
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  text-wrap: balance;
  transform-origin: var(--radix-tooltip-content-transform-origin);
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: 0;
  --tw-enter-scale: 0.95;

  &[data-state='closed'] {
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-opacity: 0;
    --tw-exit-scale: 0.95;
  }

  &[data-side='bottom'] { --tw-enter-translate-y: -0.5rem; }
  &[data-side='top'] { --tw-enter-translate-y: 0.5rem; }
  &[data-side='left'] { --tw-enter-translate-x: 0.5rem; }
  &[data-side='right'] { --tw-enter-translate-x: -0.5rem; }
`

const StyledArrow = styled(TooltipPrimitive.Arrow)`
  background-color: var(--foreground);
  fill: var(--foreground);
  z-index: 50;
  width: 0.625rem;
  height: 0.625rem;
  transform: translateY(calc(-50% - 2px)) rotate(45deg);
  border-radius: 2px;
`

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
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <StyledTooltipContent
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={className}
        {...props}
      >
        {children}
        <StyledArrow />
      </StyledTooltipContent>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

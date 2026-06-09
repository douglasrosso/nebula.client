'use client'

import * as React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import styled from 'styled-components'

const StyledHoverCardContent = styled(HoverCardPrimitive.Content)`
  background-color: var(--popover);
  color: var(--popover-foreground);
  z-index: 50;
  width: 16rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: 1rem;
  box-shadow: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
  outline: none;
  transform-origin: var(--radix-hover-card-content-transform-origin);

  &[data-state='open'] {
    animation-name: enter;
    animation-duration: 150ms;
    --tw-enter-opacity: 0;
    --tw-enter-scale: 0.95;
  }

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

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <StyledHoverCardContent
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={className}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }

'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import styled from 'styled-components'

const StyledScrollAreaRoot = styled(ScrollAreaPrimitive.Root)`
  position: relative;
`

const StyledScrollAreaViewport = styled(ScrollAreaPrimitive.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transition: color 150ms, box-shadow 150ms;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
    outline: 1px solid var(--ring);
  }
`

const StyledScrollbar = styled(ScrollAreaPrimitive.ScrollAreaScrollbar)<{ $orientation?: string }>`
  display: flex;
  touch-action: none;
  padding: 1px;
  transition: colors 150ms;
  user-select: none;

  ${({ $orientation }) =>
    $orientation === 'vertical'
      ? `
        height: 100%;
        width: 0.625rem;
        border-left: 1px solid transparent;
      `
      : `
        height: 0.625rem;
        flex-direction: column;
        border-top: 1px solid transparent;
      `}
`

const StyledScrollAreaThumb = styled(ScrollAreaPrimitive.ScrollAreaThumb)`
  background-color: var(--border);
  position: relative;
  flex: 1;
  border-radius: 9999px;
`

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <StyledScrollAreaRoot
      data-slot="scroll-area"
      className={className}
      {...props}
    >
      <StyledScrollAreaViewport data-slot="scroll-area-viewport">
        {children}
      </StyledScrollAreaViewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </StyledScrollAreaRoot>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <StyledScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      $orientation={orientation}
      className={className}
      {...props}
    >
      <StyledScrollAreaThumb data-slot="scroll-area-thumb" />
    </StyledScrollbar>
  )
}

export { ScrollArea, ScrollBar }

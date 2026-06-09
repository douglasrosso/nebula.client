import * as React from 'react'
import styled from 'styled-components'

const StyledKbd = styled.kbd`
  background-color: var(--muted);
  color: var(--muted-foreground);
  pointer-events: none;
  display: inline-flex;
  height: 1.25rem;
  min-width: 1.25rem;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border-radius: calc(var(--radius) - 4px);
  padding: 0 0.25rem;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  user-select: none;
  width: fit-content;

  & svg:not([class*='size-']) {
    width: 0.75rem;
    height: 0.75rem;
  }

  [data-slot='tooltip-content'] & {
    background-color: color-mix(in oklch, var(--background) 20%, transparent);
    color: var(--background);
  }
`

const StyledKbdGroup = styled.kbd`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <StyledKbd
      data-slot="kbd"
      className={className}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledKbdGroup
      data-slot="kbd-group"
      className={className}
      {...(props as React.ComponentProps<'kbd'>)}
    />
  )
}

export { Kbd, KbdGroup }

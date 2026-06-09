'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import styled from 'styled-components'

const StyledSwitchRoot = styled(SwitchPrimitive.Root)`
  display: inline-flex;
  height: 1.15rem;
  width: 2rem;
  flex-shrink: 0;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  cursor: pointer;

  &[data-state='checked'] {
    background-color: var(--primary);
  }

  &[data-state='unchecked'] {
    background-color: var(--input);
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const StyledSwitchThumb = styled(SwitchPrimitive.Thumb)`
  background-color: var(--background);
  pointer-events: none;
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  box-shadow: 0 0 0 0;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &[data-state='checked'] {
    transform: translateX(calc(100% - 2px));
  }

  &[data-state='unchecked'] {
    transform: translateX(0);
  }
`

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <StyledSwitchRoot
      data-slot="switch"
      className={className}
      {...props}
    >
      <StyledSwitchThumb data-slot="switch-thumb" />
    </StyledSwitchRoot>
  )
}

export { Switch }

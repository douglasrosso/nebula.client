'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import styled from 'styled-components'

const StyledCheckboxRoot = styled(CheckboxPrimitive.Root)`
  border: 1px solid var(--input);
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: box-shadow 150ms;
  outline: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &[data-state='checked'] {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &[aria-invalid='true'] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const StyledCheckboxIndicator = styled(CheckboxPrimitive.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  transition: none;
`

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <StyledCheckboxRoot
      data-slot="checkbox"
      className={className}
      {...props}
    >
      <StyledCheckboxIndicator data-slot="checkbox-indicator">
        <CheckIcon style={{ width: '0.875rem', height: '0.875rem' }} />
      </StyledCheckboxIndicator>
    </StyledCheckboxRoot>
  )
}

export { Checkbox }

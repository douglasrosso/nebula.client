'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'
import styled from 'styled-components'

const StyledRadioGroupRoot = styled(RadioGroupPrimitive.Root)`
  display: grid;
  gap: 0.75rem;
`

const StyledRadioGroupItem = styled(RadioGroupPrimitive.Item)`
  border: 1px solid var(--input);
  color: var(--primary);
  aspect-ratio: 1 / 1;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

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

const StyledRadioGroupIndicator = styled(RadioGroupPrimitive.Indicator)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <StyledRadioGroupRoot
      data-slot="radio-group"
      className={className}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <StyledRadioGroupItem
      data-slot="radio-group-item"
      className={className}
      {...props}
    >
      <StyledRadioGroupIndicator data-slot="radio-group-indicator">
        <CircleIcon
          style={{
            fill: 'var(--primary)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0.5rem',
            height: '0.5rem',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </StyledRadioGroupIndicator>
    </StyledRadioGroupItem>
  )
}

export { RadioGroup, RadioGroupItem }

'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import styled, { css } from 'styled-components'

type ToggleVariant = 'default' | 'outline'
type ToggleSize = 'default' | 'sm' | 'lg'

interface ToggleProps extends React.ComponentProps<typeof TogglePrimitive.Root> {
  variant?: ToggleVariant
  size?: ToggleSize
}

const variantStyles: Record<ToggleVariant, ReturnType<typeof css>> = {
  default: css`background-color: transparent;`,
  outline: css`
    border: 1px solid var(--input);
    background-color: transparent;
    box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
    &:hover { background-color: var(--accent); color: var(--accent-foreground); }
  `,
}

const sizeStyles: Record<ToggleSize, ReturnType<typeof css>> = {
  default: css`height: 2.25rem; padding: 0 0.5rem; min-width: 2.25rem;`,
  sm: css`height: 2rem; padding: 0 0.375rem; min-width: 2rem;`,
  lg: css`height: 2.5rem; padding: 0 0.625rem; min-width: 2.5rem;`,
}

const StyledToggle = styled(TogglePrimitive.Root)<{ $variant?: ToggleVariant; $size?: ToggleSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: var(--muted);
    color: var(--muted-foreground);
  }

  &[data-state='on'] {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[aria-invalid='true'] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
  }

  ${({ $variant = 'default' }) => variantStyles[$variant]}
  ${({ $size = 'default' }) => sizeStyles[$size]}
`

function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ToggleProps) {
  return (
    <StyledToggle
      data-slot="toggle"
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    />
  )
}

// toggleVariants kept for toggle-group compatibility
function toggleVariants({ variant = 'default', size = 'default' }: { variant?: ToggleVariant; size?: ToggleSize } = {}) {
  return `toggle-variant-${variant} toggle-size-${size}`
}

export { Toggle, toggleVariants }
export type { ToggleVariant, ToggleSize }

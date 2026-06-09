'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import styled, { css } from 'styled-components'

import type { ToggleVariant, ToggleSize } from '@/components/ui/toggle'

type ToggleGroupContextValue = {
  variant?: ToggleVariant
  size?: ToggleSize
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: 'default',
  variant: 'default',
})

const StyledToggleGroup = styled(ToggleGroupPrimitive.Root)`
  display: flex;
  width: fit-content;
  align-items: center;
  border-radius: var(--radius-md);

  &[data-variant='outline'] {
    box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  }
`

const getToggleItemVariantStyles = (variant?: ToggleVariant) => {
  if (variant === 'outline') {
    return css`
      border: 1px solid var(--input);
      background-color: transparent;
      box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
      &:hover { background-color: var(--accent); color: var(--accent-foreground); }
      border-left-width: 0;
      &:first-child { border-left-width: 1px; }
    `
  }
  return css`background-color: transparent;`
}

const getToggleItemSizeStyles = (size?: ToggleSize) => {
  if (size === 'sm') return css`height: 2rem; padding: 0 0.375rem; min-width: 2rem;`
  if (size === 'lg') return css`height: 2.5rem; padding: 0 0.625rem; min-width: 2.5rem;`
  return css`height: 2.25rem; padding: 0 0.5rem; min-width: 2.25rem;`
}

const StyledToggleGroupItem = styled(ToggleGroupPrimitive.Item)<{ $variant?: ToggleVariant; $size?: ToggleSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  cursor: pointer;
  min-width: 0;
  flex: 1;
  flex-shrink: 0;
  border-radius: 0;
  box-shadow: none;
  border: none;
  background-color: transparent;

  &:first-child { border-radius: var(--radius-md) 0 0 var(--radius-md); }
  &:last-child { border-radius: 0 var(--radius-md) var(--radius-md) 0; }

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

  &:focus {
    z-index: 10;
    position: relative;
  }

  &:focus-visible {
    z-index: 10;
    position: relative;
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  ${({ $variant }) => getToggleItemVariantStyles($variant)}
  ${({ $size }) => getToggleItemSizeStyles($size)}
`

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & ToggleGroupContextValue) {
  return (
    <StyledToggleGroup
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={className}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </StyledToggleGroup>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & ToggleGroupContextValue) {
  const context = React.useContext(ToggleGroupContext)
  const resolvedVariant = context.variant || variant
  const resolvedSize = context.size || size

  return (
    <StyledToggleGroupItem
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      $variant={resolvedVariant}
      $size={resolvedSize}
      className={className}
      {...props}
    >
      {children}
    </StyledToggleGroupItem>
  )
}

export { ToggleGroup, ToggleGroupItem }

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import styled, { css } from 'styled-components'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

interface BadgeProps extends React.ComponentProps<'span'> {
  variant?: BadgeVariant
  asChild?: boolean
}

const variantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  default: css`
    border-color: transparent;
    background-color: var(--primary);
    color: var(--primary-foreground);
    a&:hover { background-color: color-mix(in oklch, var(--primary) 90%, black); }
  `,
  secondary: css`
    border-color: transparent;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    a&:hover { background-color: color-mix(in oklch, var(--secondary) 90%, black); }
  `,
  destructive: css`
    border-color: transparent;
    background-color: var(--destructive);
    color: white;
    a&:hover { background-color: color-mix(in oklch, var(--destructive) 90%, black); }
    &:focus-visible { box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent); }
  `,
  outline: css`
    color: var(--foreground);
    a&:hover { background-color: var(--accent); color: var(--accent-foreground); }
  `,
}

const StyledBadge = styled.span<{ $variant?: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 0.25rem;
  overflow: hidden;
  transition: color 150ms, box-shadow 150ms;

  & > svg {
    width: 0.75rem;
    height: 0.75rem;
    pointer-events: none;
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
    outline: none;
  }

  &[aria-invalid='true'] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
  }

  ${({ $variant = 'default' }) => variantStyles[$variant]}
`

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: BadgeProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="badge"
        className={className}
        {...props}
      />
    )
  }

  return (
    <StyledBadge
      data-slot="badge"
      $variant={variant}
      className={className}
      {...props}
    />
  )
}

export { Badge }

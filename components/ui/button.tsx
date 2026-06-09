import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import styled, { css } from 'styled-components'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  default: css`
    background-color: var(--primary);
    color: var(--primary-foreground);
    &:hover { background-color: color-mix(in oklch, var(--primary) 90%, black); }
  `,
  destructive: css`
    background-color: var(--destructive);
    color: white;
    &:hover { background-color: color-mix(in oklch, var(--destructive) 90%, black); }
    &:focus-visible { box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent); }
  `,
  outline: css`
    border: 1px solid var(--border);
    background-color: var(--background);
    box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
    &:hover { background-color: var(--accent); color: var(--accent-foreground); }
  `,
  secondary: css`
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    &:hover { background-color: color-mix(in oklch, var(--secondary) 80%, black); }
  `,
  ghost: css`
    &:hover { background-color: var(--accent); color: var(--accent-foreground); }
  `,
  link: css`
    color: var(--primary);
    text-underline-offset: 4px;
    &:hover { text-decoration: underline; }
  `,
}

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  default: css`height: 2.25rem; padding: 0.5rem 1rem;`,
  sm: css`height: 2rem; border-radius: var(--radius-md); gap: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.875rem;`,
  lg: css`height: 2.5rem; border-radius: var(--radius-md); padding: 0.5rem 1.5rem;`,
  icon: css`width: 2.25rem; height: 2.25rem; padding: 0;`,
  'icon-sm': css`width: 2rem; height: 2rem; padding: 0;`,
  'icon-lg': css`width: 2.5rem; height: 2.5rem; padding: 0;`,
}

const StyledButton = styled.button<{ $variant?: ButtonVariant; $size?: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: inherit;

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &[aria-invalid='true'] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
  }

  ${({ $variant = 'default' }) => variantStyles[$variant]}
  ${({ $size = 'default' }) => sizeStyles[$size]}
`

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={className}
        {...props}
      />
    )
  }

  return (
    <StyledButton
      data-slot="button"
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    />
  )
}

// buttonVariants kept for compatibility with components that use it for className generation
function buttonVariants({ variant = 'default', size = 'default' }: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return `button-variant-${variant} button-size-${size}`
}

export { Button, buttonVariants }
export type { ButtonVariant, ButtonSize }

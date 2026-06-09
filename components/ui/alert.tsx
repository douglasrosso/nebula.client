import * as React from 'react'
import styled, { css } from 'styled-components'

type AlertVariant = 'default' | 'destructive'

interface AlertProps extends React.ComponentProps<'div'> {
  variant?: AlertVariant
}

const variantStyles: Record<AlertVariant, ReturnType<typeof css>> = {
  default: css`
    background-color: var(--card);
    color: var(--card-foreground);
  `,
  destructive: css`
    color: var(--destructive);
    background-color: var(--card);

    & > svg {
      color: currentColor;
    }

    *[data-slot='alert-description'] {
      color: color-mix(in oklch, var(--destructive) 90%, transparent);
    }
  `,
}

const StyledAlert = styled.div<{ $variant?: AlertVariant }>`
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: grid;
  grid-template-columns: 0 1fr;
  grid-template-rows: auto auto;
  gap: 0 0;
  align-items: start;

  &:has(> svg) {
    grid-template-columns: calc(var(--spacing, 0.25rem) * 4) 1fr;
    gap: 0 0.75rem;
  }

  & > svg {
    width: 1rem;
    height: 1rem;
    transform: translateY(0.125rem);
    color: currentColor;
  }

  ${({ $variant = 'default' }) => variantStyles[$variant]}
`

const StyledAlertTitle = styled.div`
  grid-column-start: 2;
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1;
  min-height: 1rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

const StyledAlertDescription = styled.div`
  color: var(--muted-foreground);
  grid-column-start: 2;
  display: grid;
  justify-items: start;
  gap: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;

  & p {
    line-height: 1.625;
  }
`

function Alert({
  className,
  variant = 'default',
  ...props
}: AlertProps) {
  return (
    <StyledAlert
      data-slot="alert"
      role="alert"
      $variant={variant}
      className={className}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledAlertTitle
      data-slot="alert-title"
      className={className}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <StyledAlertDescription
      data-slot="alert-description"
      className={className}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }

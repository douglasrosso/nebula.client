import * as React from 'react'
import styled from 'styled-components'

const StyledCard = styled.div`
  background-color: var(--card);
  color: var(--card-foreground);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  padding: 1.5rem 0;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
`

const StyledCardHeader = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  align-items: start;
  gap: 0.5rem;
  padding: 0 1.5rem;

  &:has([data-slot='card-action']) {
    grid-template-columns: 1fr auto;
  }

  &.border-b {
    padding-bottom: 1.5rem;
  }
`

const StyledCardTitle = styled.div`
  line-height: 1;
  font-weight: 600;
`

const StyledCardDescription = styled.div`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`

const StyledCardAction = styled.div`
  grid-column-start: 2;
  grid-row: 1 / span 2;
  align-self: start;
  justify-self: end;
`

const StyledCardContent = styled.div`
  padding: 0 1.5rem;
`

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1.5rem;

  &.border-t {
    padding-top: 1.5rem;
  }
`

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledCard
      data-slot="card"
      className={className}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledCardHeader
      data-slot="card-header"
      className={className}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledCardTitle
      data-slot="card-title"
      className={className}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledCardDescription
      data-slot="card-description"
      className={className}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledCardAction
      data-slot="card-action"
      className={className}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledCardContent
      data-slot="card-content"
      className={className}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledCardFooter
      data-slot="card-footer"
      className={className}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

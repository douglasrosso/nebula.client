import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import styled from 'styled-components'

const StyledBreadcrumbList = styled.ol`
  color: var(--muted-foreground);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  word-break: break-word;

  @media (min-width: 640px) {
    gap: 0.625rem;
  }
`

const StyledBreadcrumbItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`

const StyledBreadcrumbLink = styled.a`
  transition: color 150ms;

  &:hover {
    color: var(--foreground);
  }
`

const StyledBreadcrumbPage = styled.span`
  color: var(--foreground);
  font-weight: 400;
`

const StyledBreadcrumbSeparator = styled.li`
  & > svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`

const StyledBreadcrumbEllipsis = styled.span`
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
`

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <StyledBreadcrumbList
      data-slot="breadcrumb-list"
      className={className}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <StyledBreadcrumbItem
      data-slot="breadcrumb-item"
      className={className}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : StyledBreadcrumbLink

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={className}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <StyledBreadcrumbPage
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={className}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <StyledBreadcrumbSeparator
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children ?? <ChevronRight />}
    </StyledBreadcrumbSeparator>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <StyledBreadcrumbEllipsis
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <MoreHorizontal style={{ width: '1rem', height: '1rem' }} />
      <SrOnly>More</SrOnly>
    </StyledBreadcrumbEllipsis>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}

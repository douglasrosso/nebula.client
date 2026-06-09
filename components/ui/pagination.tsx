import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'
import styled, { css } from 'styled-components'

import { Button } from '@/components/ui/button'
import type { ButtonVariant, ButtonSize } from '@/components/ui/button'

const StyledNav = styled.nav`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  width: 100%;
  justify-content: center;
`

const StyledPaginationContent = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
`

const ghostButtonCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 150ms;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: inherit;
  text-decoration: none;

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &[data-active='true'] {
    border: 1px solid var(--border);
    background-color: var(--background);
    box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  }
`

const StyledPaginationLink = styled.a`
  ${ghostButtonCss}
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
`

const StyledPaginationPrevNext = styled.a`
  ${ghostButtonCss}
  height: 2.25rem;
  padding: 0.5rem 0.625rem;
  gap: 0.25rem;
`

const StyledPaginationEllipsis = styled.span`
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

const HiddenSm = styled.span`
  @media (max-width: 639px) {
    display: none;
  }
`

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <StyledNav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={className}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <StyledPaginationContent
      data-slot="pagination-content"
      className={className}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  size?: ButtonSize
} & React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <StyledPaginationLink
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={className}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <StyledPaginationPrevNext
      aria-label="Go to previous page"
      data-slot="pagination-link"
      className={className}
      {...props}
    >
      <ChevronLeftIcon style={{ width: '1rem', height: '1rem' }} />
      <HiddenSm>Previous</HiddenSm>
    </StyledPaginationPrevNext>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <StyledPaginationPrevNext
      aria-label="Go to next page"
      data-slot="pagination-link"
      className={className}
      {...props}
    >
      <HiddenSm>Next</HiddenSm>
      <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
    </StyledPaginationPrevNext>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <StyledPaginationEllipsis
      aria-hidden
      data-slot="pagination-ellipsis"
      className={className}
      {...props}
    >
      <MoreHorizontalIcon style={{ width: '1rem', height: '1rem' }} />
      <SrOnly>More pages</SrOnly>
    </StyledPaginationEllipsis>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

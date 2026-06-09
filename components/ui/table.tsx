'use client'

import * as React from 'react'
import styled from 'styled-components'

const TableContainer = styled.div`
  position: relative;
  width: 100%;
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  caption-side: bottom;
  font-size: 0.875rem;
  line-height: 1.25rem;
`

const StyledThead = styled.thead`
  & tr {
    border-bottom: 1px solid var(--border);
  }
`

const StyledTbody = styled.tbody`
  & tr:last-child {
    border-bottom: none;
  }
`

const StyledTfoot = styled.tfoot`
  background-color: color-mix(in oklch, var(--muted) 50%, transparent);
  border-top: 1px solid var(--border);
  font-weight: 500;

  & > tr:last-child {
    border-bottom: none;
  }
`

const StyledTr = styled.tr`
  border-bottom: 1px solid var(--border);
  transition: colors 150ms;

  &:hover {
    background-color: color-mix(in oklch, var(--muted) 50%, transparent);
  }

  &[data-state='selected'] {
    background-color: var(--muted);
  }
`

const StyledTh = styled.th`
  color: var(--foreground);
  height: 2.5rem;
  padding: 0 0.5rem;
  text-align: left;
  vertical-align: middle;
  font-weight: 500;
  white-space: nowrap;

  &:has([role='checkbox']) {
    padding-right: 0;
  }

  & > [role='checkbox'] {
    transform: translateY(2px);
  }
`

const StyledTd = styled.td`
  padding: 0.5rem;
  vertical-align: middle;
  white-space: nowrap;

  &:has([role='checkbox']) {
    padding-right: 0;
  }

  & > [role='checkbox'] {
    transform: translateY(2px);
  }
`

const StyledCaption = styled.caption`
  color: var(--muted-foreground);
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
`

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <TableContainer data-slot="table-container">
      <StyledTable
        data-slot="table"
        className={className}
        {...props}
      />
    </TableContainer>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <StyledThead
      data-slot="table-header"
      className={className}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <StyledTbody
      data-slot="table-body"
      className={className}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <StyledTfoot
      data-slot="table-footer"
      className={className}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <StyledTr
      data-slot="table-row"
      className={className}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <StyledTh
      data-slot="table-head"
      className={className}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <StyledTd
      data-slot="table-cell"
      className={className}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <StyledCaption
      data-slot="table-caption"
      className={className}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

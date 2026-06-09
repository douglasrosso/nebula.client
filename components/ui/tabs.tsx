'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import styled from 'styled-components'

const StyledTabsRoot = styled(TabsPrimitive.Root)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledTabsList = styled(TabsPrimitive.List)`
  background-color: var(--muted);
  color: var(--muted-foreground);
  display: inline-flex;
  height: 2.25rem;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  padding: 3px;
`

const StyledTabsTrigger = styled(TabsPrimitive.Trigger)`
  color: var(--foreground);
  display: inline-flex;
  height: calc(100% - 1px);
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  cursor: pointer;
  background-color: transparent;

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }

  &[data-state='active'] {
    background-color: var(--background);
    box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
    outline: 1px solid var(--ring);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`

const StyledTabsContent = styled(TabsPrimitive.Content)`
  flex: 1;
  outline: none;
`

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <StyledTabsRoot
      data-slot="tabs"
      className={className}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <StyledTabsList
      data-slot="tabs-list"
      className={className}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <StyledTabsTrigger
      data-slot="tabs-trigger"
      className={className}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <StyledTabsContent
      data-slot="tabs-content"
      className={className}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

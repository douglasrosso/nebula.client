'use client'

import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import styled from 'styled-components'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const StyledCommand = styled(CommandPrimitive)`
  background-color: var(--popover);
  color: var(--popover-foreground);
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--radius-md);
`

const StyledCommandInputWrapper = styled.div`
  display: flex;
  height: 2.25rem;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding: 0 0.75rem;
`

const StyledCommandInput = styled(CommandPrimitive.Input)`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: var(--radius-md);
  background-color: transparent;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
  border: none;
  color: inherit;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const StyledCommandList = styled(CommandPrimitive.List)`
  max-height: 300px;
  scroll-padding-top: 0.25rem;
  scroll-padding-bottom: 0.25rem;
  overflow-x: hidden;
  overflow-y: auto;
`

const StyledCommandEmpty = styled(CommandPrimitive.Empty)`
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
`

const StyledCommandGroup = styled(CommandPrimitive.Group)`
  color: var(--foreground);
  overflow: hidden;
  padding: 0.25rem;

  & [cmdk-group-heading] {
    color: var(--muted-foreground);
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
  }
`

const StyledCommandSeparator = styled(CommandPrimitive.Separator)`
  background-color: var(--border);
  margin: 0 -0.25rem;
  height: 1px;
`

const StyledCommandItem = styled(CommandPrimitive.Item)`
  position: relative;
  display: flex;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: calc(var(--radius) - 4px);
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
  user-select: none;

  &[data-selected='true'] {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &[data-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }

  & svg:not([class*='text-']) {
    color: var(--muted-foreground);
  }
`

const StyledCommandShortcut = styled.span`
  color: var(--muted-foreground);
  margin-left: auto;
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.1em;
`

const DialogCommandWrapper = styled(CommandPrimitive)`
  & [cmdk-group-heading] {
    color: var(--muted-foreground);
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  & [cmdk-group] {
    padding: 0 0.5rem;
  }

  & [cmdk-group]:not([hidden]) ~ [cmdk-group] {
    padding-top: 0;
  }

  & [cmdk-input-wrapper] svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  & [cmdk-input] {
    height: 3rem;
  }

  & [cmdk-item] {
    padding: 0.75rem 0.5rem;
  }

  & [cmdk-item] svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  *[data-slot='command-input-wrapper'] {
    height: 3rem;
  }
`

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <StyledCommand
      data-slot="command"
      className={className}
      {...props}
    />
  )
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={className}
        showCloseButton={showCloseButton}
        style={{ overflow: 'hidden', padding: 0 }}
      >
        <DialogCommandWrapper>
          {children}
        </DialogCommandWrapper>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <StyledCommandInputWrapper data-slot="command-input-wrapper">
      <SearchIcon style={{ width: '1rem', height: '1rem', flexShrink: 0, opacity: 0.5 }} />
      <StyledCommandInput
        data-slot="command-input"
        className={className}
        {...props}
      />
    </StyledCommandInputWrapper>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <StyledCommandList
      data-slot="command-list"
      className={className}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <StyledCommandEmpty
      data-slot="command-empty"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <StyledCommandGroup
      data-slot="command-group"
      className={className}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <StyledCommandSeparator
      data-slot="command-separator"
      className={className}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <StyledCommandItem
      data-slot="command-item"
      className={className}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <StyledCommandShortcut
      data-slot="command-shortcut"
      className={className}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

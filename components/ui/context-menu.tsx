'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import styled from 'styled-components'

const menuContentStyles = `
  background-color: var(--popover);
  color: var(--popover-foreground);
  z-index: 50;
  min-width: 8rem;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
  transform-origin: var(--radix-context-menu-content-transform-origin);

  &[data-state='open'] {
    animation-name: enter;
    animation-duration: 150ms;
    --tw-enter-opacity: 0;
    --tw-enter-scale: 0.95;
  }

  &[data-state='closed'] {
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-opacity: 0;
    --tw-exit-scale: 0.95;
  }

  &[data-side='bottom'] { --tw-enter-translate-y: -0.5rem; }
  &[data-side='top'] { --tw-enter-translate-y: 0.5rem; }
  &[data-side='left'] { --tw-enter-translate-x: 0.5rem; }
  &[data-side='right'] { --tw-enter-translate-x: -0.5rem; }
`

const menuItemStyles = `
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

  &:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-inset] {
    padding-left: 2rem;
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

  &[data-variant='destructive'] {
    color: var(--destructive);

    &:focus {
      background-color: color-mix(in oklch, var(--destructive) 10%, transparent);
      color: var(--destructive);
    }
  }
`

const StyledContextMenuContent = styled(ContextMenuPrimitive.Content)`
  ${menuContentStyles}
  max-height: var(--radix-context-menu-content-available-height);
`

const StyledContextMenuSubContent = styled(ContextMenuPrimitive.SubContent)`
  ${menuContentStyles}
  box-shadow: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1);
`

const StyledContextMenuSubTrigger = styled(ContextMenuPrimitive.SubTrigger)`
  display: flex;
  cursor: default;
  align-items: center;
  border-radius: calc(var(--radius) - 4px);
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
  user-select: none;

  &:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &[data-state='open'] {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &[data-inset] {
    padding-left: 2rem;
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

const StyledContextMenuItem = styled(ContextMenuPrimitive.Item)`
  ${menuItemStyles}
`

const StyledContextMenuCheckboxItem = styled(ContextMenuPrimitive.CheckboxItem)`
  ${menuItemStyles}
  padding-left: 2rem;
  padding-right: 0.5rem;
`

const StyledContextMenuRadioItem = styled(ContextMenuPrimitive.RadioItem)`
  ${menuItemStyles}
  padding-left: 2rem;
  padding-right: 0.5rem;
`

const StyledContextMenuLabel = styled(ContextMenuPrimitive.Label)`
  color: var(--foreground);
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;

  &[data-inset] {
    padding-left: 2rem;
  }
`

const StyledContextMenuSeparator = styled(ContextMenuPrimitive.Separator)`
  background-color: var(--border);
  margin: 0.25rem -0.25rem;
  height: 1px;
`

const StyledContextMenuShortcut = styled.span`
  color: var(--muted-foreground);
  margin-left: auto;
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.1em;
`

const ItemIndicatorWrapper = styled.span`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <StyledContextMenuSubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={className}
      {...props}
    >
      {children}
      <ChevronRightIcon style={{ marginLeft: 'auto', width: '1rem', height: '1rem' }} />
    </StyledContextMenuSubTrigger>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <StyledContextMenuSubContent
      data-slot="context-menu-sub-content"
      className={className}
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <StyledContextMenuContent
        data-slot="context-menu-content"
        className={className}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <StyledContextMenuItem
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={className}
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <StyledContextMenuCheckboxItem
      data-slot="context-menu-checkbox-item"
      className={className}
      checked={checked}
      {...props}
    >
      <ItemIndicatorWrapper>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
        </ContextMenuPrimitive.ItemIndicator>
      </ItemIndicatorWrapper>
      {children}
    </StyledContextMenuCheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <StyledContextMenuRadioItem
      data-slot="context-menu-radio-item"
      className={className}
      {...props}
    >
      <ItemIndicatorWrapper>
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon style={{ width: '0.5rem', height: '0.5rem', fill: 'currentColor' }} />
        </ContextMenuPrimitive.ItemIndicator>
      </ItemIndicatorWrapper>
      {children}
    </StyledContextMenuRadioItem>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <StyledContextMenuLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={className}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <StyledContextMenuSeparator
      data-slot="context-menu-separator"
      className={className}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <StyledContextMenuShortcut
      data-slot="context-menu-shortcut"
      className={className}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}

'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
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
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);

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
  transition: none;

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

const StyledDropdownMenuContent = styled(DropdownMenuPrimitive.Content)`
  ${menuContentStyles}
  max-height: var(--radix-dropdown-menu-content-available-height);
`

const StyledDropdownMenuItem = styled(DropdownMenuPrimitive.Item)`
  ${menuItemStyles}
`

const StyledDropdownMenuCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem)`
  ${menuItemStyles}
  padding-left: 2rem;
  padding-right: 0.5rem;
`

const StyledDropdownMenuRadioItem = styled(DropdownMenuPrimitive.RadioItem)`
  ${menuItemStyles}
  padding-left: 2rem;
  padding-right: 0.5rem;
`

const StyledDropdownMenuLabel = styled(DropdownMenuPrimitive.Label)`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;

  &[data-inset] {
    padding-left: 2rem;
  }
`

const StyledDropdownMenuSeparator = styled(DropdownMenuPrimitive.Separator)`
  background-color: var(--border);
  margin: 0.25rem -0.25rem;
  height: 1px;
`

const StyledDropdownMenuShortcut = styled.span`
  color: var(--muted-foreground);
  margin-left: auto;
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.1em;
`

const StyledDropdownMenuSubTrigger = styled(DropdownMenuPrimitive.SubTrigger)`
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

const StyledDropdownMenuSubContent = styled(DropdownMenuPrimitive.SubContent)`
  ${menuContentStyles}
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  min-width: 8rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1);
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

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <StyledDropdownMenuContent
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={className}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <StyledDropdownMenuItem
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={className}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <StyledDropdownMenuCheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={className}
      checked={checked}
      {...props}
    >
      <ItemIndicatorWrapper>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
        </DropdownMenuPrimitive.ItemIndicator>
      </ItemIndicatorWrapper>
      {children}
    </StyledDropdownMenuCheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <StyledDropdownMenuRadioItem
      data-slot="dropdown-menu-radio-item"
      className={className}
      {...props}
    >
      <ItemIndicatorWrapper>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon style={{ width: '0.5rem', height: '0.5rem', fill: 'currentColor' }} />
        </DropdownMenuPrimitive.ItemIndicator>
      </ItemIndicatorWrapper>
      {children}
    </StyledDropdownMenuRadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <StyledDropdownMenuLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={className}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <StyledDropdownMenuSeparator
      data-slot="dropdown-menu-separator"
      className={className}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <StyledDropdownMenuShortcut
      data-slot="dropdown-menu-shortcut"
      className={className}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <StyledDropdownMenuSubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={className}
      {...props}
    >
      {children}
      <ChevronRightIcon style={{ marginLeft: 'auto', width: '1rem', height: '1rem' }} />
    </StyledDropdownMenuSubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <StyledDropdownMenuSubContent
      data-slot="dropdown-menu-sub-content"
      className={className}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

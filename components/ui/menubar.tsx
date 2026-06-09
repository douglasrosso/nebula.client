'use client'

import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import styled from 'styled-components'

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

const menuContentStyles = `
  background-color: var(--popover);
  color: var(--popover-foreground);
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
  transform-origin: var(--radix-menubar-content-transform-origin);

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

const StyledMenubar = styled(MenubarPrimitive.Root)`
  background-color: var(--background);
  display: flex;
  height: 2.25rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: 0.25rem;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
`

const StyledMenubarTrigger = styled(MenubarPrimitive.Trigger)`
  display: flex;
  align-items: center;
  border-radius: calc(var(--radius) - 4px);
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  outline: none;
  user-select: none;
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;

  &:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &[data-state='open'] {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
`

const StyledMenubarContent = styled(MenubarPrimitive.Content)`
  ${menuContentStyles}
  min-width: 12rem;
`

const StyledMenubarItem = styled(MenubarPrimitive.Item)`
  ${menuItemStyles}
`

const StyledMenubarCheckboxItem = styled(MenubarPrimitive.CheckboxItem)`
  ${menuItemStyles}
  border-radius: 2px;
  padding-left: 2rem;
  padding-right: 0.5rem;
`

const StyledMenubarRadioItem = styled(MenubarPrimitive.RadioItem)`
  ${menuItemStyles}
  border-radius: 2px;
  padding-left: 2rem;
  padding-right: 0.5rem;
`

const StyledMenubarLabel = styled(MenubarPrimitive.Label)`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;

  &[data-inset] {
    padding-left: 2rem;
  }
`

const StyledMenubarSeparator = styled(MenubarPrimitive.Separator)`
  background-color: var(--border);
  margin: 0.25rem -0.25rem;
  height: 1px;
`

const StyledMenubarShortcut = styled.span`
  color: var(--muted-foreground);
  margin-left: auto;
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.1em;
`

const StyledMenubarSubTrigger = styled(MenubarPrimitive.SubTrigger)`
  display: flex;
  cursor: default;
  align-items: center;
  border-radius: calc(var(--radius) - 4px);
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
  user-select: none;
  background: none;
  border: none;
  color: inherit;

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
`

const StyledMenubarSubContent = styled(MenubarPrimitive.SubContent)`
  ${menuContentStyles}
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

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <StyledMenubar
      data-slot="menubar"
      className={className}
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <StyledMenubarTrigger
      data-slot="menubar-trigger"
      className={className}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <StyledMenubarContent
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={className}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <StyledMenubarItem
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={className}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <StyledMenubarCheckboxItem
      data-slot="menubar-checkbox-item"
      className={className}
      checked={checked}
      {...props}
    >
      <ItemIndicatorWrapper>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
        </MenubarPrimitive.ItemIndicator>
      </ItemIndicatorWrapper>
      {children}
    </StyledMenubarCheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <StyledMenubarRadioItem
      data-slot="menubar-radio-item"
      className={className}
      {...props}
    >
      <ItemIndicatorWrapper>
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon style={{ width: '0.5rem', height: '0.5rem', fill: 'currentColor' }} />
        </MenubarPrimitive.ItemIndicator>
      </ItemIndicatorWrapper>
      {children}
    </StyledMenubarRadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <StyledMenubarLabel
      data-slot="menubar-label"
      data-inset={inset}
      className={className}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <StyledMenubarSeparator
      data-slot="menubar-separator"
      className={className}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <StyledMenubarShortcut
      data-slot="menubar-shortcut"
      className={className}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <StyledMenubarSubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={className}
      {...props}
    >
      {children}
      <ChevronRightIcon style={{ marginLeft: 'auto', width: '1rem', height: '1rem' }} />
    </StyledMenubarSubTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <StyledMenubarSubContent
      data-slot="menubar-sub-content"
      className={className}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}

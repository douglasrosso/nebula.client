'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import styled from 'styled-components'

const StyledSelectTrigger = styled(SelectPrimitive.Trigger)`
  border: 1px solid var(--input);
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-radius: var(--radius-md);
  background-color: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  white-space: nowrap;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  cursor: pointer;
  color: inherit;

  &[data-size='default'] { height: 2.25rem; }
  &[data-size='sm'] { height: 2rem; }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
    color: var(--muted-foreground);
  }

  & [data-placeholder] {
    color: var(--muted-foreground);
  }

  *[data-slot='select-value'] {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &[aria-invalid='true'] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    background-color: color-mix(in oklch, var(--input) 50%, transparent);
  }
`

const StyledSelectContent = styled(SelectPrimitive.Content)<{ $isPopper?: boolean }>`
  background-color: var(--popover);
  color: var(--popover-foreground);
  position: relative;
  z-index: 50;
  max-height: var(--radix-select-content-available-height);
  min-width: 8rem;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
  transform-origin: var(--radix-select-content-transform-origin);

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

  ${({ $isPopper }) =>
    $isPopper &&
    `
    &[data-side='bottom'] { transform: translateY(0.25rem); }
    &[data-side='top'] { transform: translateY(-0.25rem); }
    &[data-side='left'] { transform: translateX(-0.25rem); }
    &[data-side='right'] { transform: translateX(0.25rem); }
  `}
`

const StyledSelectViewport = styled(SelectPrimitive.Viewport)<{ $isPopper?: boolean }>`
  padding: 0.25rem;

  ${({ $isPopper }) =>
    $isPopper &&
    `
    height: var(--radix-select-trigger-height);
    width: 100%;
    min-width: var(--radix-select-trigger-width);
    scroll-margin: 0.25rem 0;
  `}
`

const StyledSelectLabel = styled(SelectPrimitive.Label)`
  color: var(--muted-foreground);
  padding: 0.25rem 0.5rem 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
`

const StyledSelectItem = styled(SelectPrimitive.Item)`
  position: relative;
  display: flex;
  width: 100%;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: calc(var(--radius) - 4px);
  padding: 0.375rem 2rem 0.375rem 0.5rem;
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

const StyledItemIndicatorWrapper = styled.span`
  position: absolute;
  right: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`

const StyledSelectSeparator = styled(SelectPrimitive.Separator)`
  background-color: var(--border);
  pointer-events: none;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  height: 1px;
`

const StyledScrollButton = styled.div`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
`

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}) {
  return (
    <StyledSelectTrigger
      data-slot="select-trigger"
      data-size={size}
      className={className}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon style={{ width: '1rem', height: '1rem', opacity: 0.5 }} />
      </SelectPrimitive.Icon>
    </StyledSelectTrigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const isPopper = position === 'popper'

  return (
    <SelectPrimitive.Portal>
      <StyledSelectContent
        data-slot="select-content"
        $isPopper={isPopper}
        className={className}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <StyledSelectViewport $isPopper={isPopper}>
          {children}
        </StyledSelectViewport>
        <SelectScrollDownButton />
      </StyledSelectContent>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <StyledSelectLabel
      data-slot="select-label"
      className={className}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <StyledSelectItem
      data-slot="select-item"
      className={className}
      {...props}
    >
      <StyledItemIndicatorWrapper>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
        </SelectPrimitive.ItemIndicator>
      </StyledItemIndicatorWrapper>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </StyledSelectItem>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <StyledSelectSeparator
      data-slot="select-separator"
      className={className}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={className}
      {...props}
    >
      <StyledScrollButton>
        <ChevronUpIcon style={{ width: '1rem', height: '1rem' }} />
      </StyledScrollButton>
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={className}
      {...props}
    >
      <StyledScrollButton>
        <ChevronDownIcon style={{ width: '1rem', height: '1rem' }} />
      </StyledScrollButton>
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

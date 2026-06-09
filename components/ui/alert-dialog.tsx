'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import styled from 'styled-components'

const StyledAlertDialogOverlay = styled(AlertDialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: oklch(0 0 0 / 0.5);

  &[data-state='open'] {
    animation-name: enter;
    animation-duration: 150ms;
    --tw-enter-opacity: 0;
  }

  &[data-state='closed'] {
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-opacity: 0;
  }
`

const StyledAlertDialogContent = styled(AlertDialogPrimitive.Content)`
  background-color: var(--background);
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: calc(100% - 2rem);
  transform: translate(-50%, -50%);
  gap: 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1);
  animation-duration: 200ms;

  &[data-state='open'] {
    animation-name: enter;
    --tw-enter-opacity: 0;
    --tw-enter-scale: 0.95;
  }

  &[data-state='closed'] {
    animation-name: exit;
    --tw-exit-opacity: 0;
    --tw-exit-scale: 0.95;
  }

  @media (min-width: 640px) {
    max-width: 32rem;
  }
`

const StyledAlertDialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`

const StyledAlertDialogFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`

const StyledAlertDialogTitle = styled(AlertDialogPrimitive.Title)`
  font-size: 1.125rem;
  line-height: 1.25rem;
  font-weight: 600;
`

const StyledAlertDialogDescription = styled(AlertDialogPrimitive.Description)`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`

/* Shared button base for action/cancel */
const sharedButtonStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  height: 2.25rem;
  padding: 0.5rem 1rem;
  transition: all 150ms;
  outline: none;
  border: none;
  cursor: pointer;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }
`

const StyledAlertDialogAction = styled(AlertDialogPrimitive.Action)`
  ${sharedButtonStyles}
  background-color: var(--primary);
  color: var(--primary-foreground);

  &:hover {
    background-color: color-mix(in oklch, var(--primary) 90%, black);
  }
`

const StyledAlertDialogCancel = styled(AlertDialogPrimitive.Cancel)`
  ${sharedButtonStyles}
  border: 1px solid var(--border);
  background-color: var(--background);
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
`

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <StyledAlertDialogOverlay
      data-slot="alert-dialog-overlay"
      className={className}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <StyledAlertDialogContent
        data-slot="alert-dialog-content"
        className={className}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <StyledAlertDialogHeader
      data-slot="alert-dialog-header"
      className={className}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <StyledAlertDialogFooter
      data-slot="alert-dialog-footer"
      className={className}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <StyledAlertDialogTitle
      data-slot="alert-dialog-title"
      className={className}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <StyledAlertDialogDescription
      data-slot="alert-dialog-description"
      className={className}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <StyledAlertDialogAction
      className={className}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <StyledAlertDialogCancel
      className={className}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

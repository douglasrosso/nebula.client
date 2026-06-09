'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import styled from 'styled-components'

const StyledDialogOverlay = styled(DialogPrimitive.Overlay)`
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

const StyledDialogContent = styled(DialogPrimitive.Content)`
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

const StyledCloseButton = styled(DialogPrimitive.Close)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 2px;
  opacity: 0.7;
  transition: opacity 150ms;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }

  &:focus:not(:focus-visible) {
    box-shadow: none;
  }

  &:disabled {
    pointer-events: none;
  }

  &[data-state='open'] {
    background-color: var(--accent);
    color: var(--muted-foreground);
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }
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

const StyledDialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`

const StyledDialogFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`

const StyledDialogTitle = styled(DialogPrimitive.Title)`
  font-size: 1.125rem;
  line-height: 1;
  font-weight: 600;
`

const StyledDialogDescription = styled(DialogPrimitive.Description)`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <StyledDialogOverlay
      data-slot="dialog-overlay"
      className={className}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <StyledDialogContent
        data-slot="dialog-content"
        className={className}
        {...props}
      >
        {children}
        {showCloseButton && (
          <StyledCloseButton data-slot="dialog-close">
            <XIcon />
            <SrOnly>Close</SrOnly>
          </StyledCloseButton>
        )}
      </StyledDialogContent>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledDialogHeader
      data-slot="dialog-header"
      className={className}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledDialogFooter
      data-slot="dialog-footer"
      className={className}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <StyledDialogTitle
      data-slot="dialog-title"
      className={className}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <StyledDialogDescription
      data-slot="dialog-description"
      className={className}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

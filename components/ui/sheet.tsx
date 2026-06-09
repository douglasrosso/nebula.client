'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import styled, { css } from 'styled-components'

const StyledSheetOverlay = styled(SheetPrimitive.Overlay)`
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

const sideStyles = {
  right: css`
    inset-y: 0;
    right: 0;
    height: 100%;
    width: 75%;
    border-left: 1px solid var(--border);
    top: 0;
    bottom: 0;

    @media (min-width: 640px) {
      max-width: 24rem;
    }

    &[data-state='open'] {
      --tw-enter-translate-x: 100%;
    }

    &[data-state='closed'] {
      --tw-exit-translate-x: 100%;
    }
  `,
  left: css`
    inset-y: 0;
    left: 0;
    height: 100%;
    width: 75%;
    border-right: 1px solid var(--border);
    top: 0;
    bottom: 0;

    @media (min-width: 640px) {
      max-width: 24rem;
    }

    &[data-state='open'] {
      --tw-enter-translate-x: -100%;
    }

    &[data-state='closed'] {
      --tw-exit-translate-x: -100%;
    }
  `,
  top: css`
    inset-x: 0;
    top: 0;
    height: auto;
    border-bottom: 1px solid var(--border);
    left: 0;
    right: 0;

    &[data-state='open'] {
      --tw-enter-translate-y: -100%;
    }

    &[data-state='closed'] {
      --tw-exit-translate-y: -100%;
    }
  `,
  bottom: css`
    inset-x: 0;
    bottom: 0;
    height: auto;
    border-top: 1px solid var(--border);
    left: 0;
    right: 0;

    &[data-state='open'] {
      --tw-enter-translate-y: 100%;
    }

    &[data-state='closed'] {
      --tw-exit-translate-y: 100%;
    }
  `,
}

const StyledSheetContent = styled(SheetPrimitive.Content)<{ $side?: string }>`
  background-color: var(--background);
  position: fixed;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 10px 15px -3px oklch(0 0 0 / 0.1);
  transition: transform 300ms ease-in-out;

  &[data-state='open'] {
    animation-name: enter;
    animation-duration: 500ms;
    animation-timing-function: ease-in-out;
  }

  &[data-state='closed'] {
    animation-name: exit;
    animation-duration: 300ms;
    animation-timing-function: ease-in-out;
  }

  ${({ $side = 'right' }) => sideStyles[$side as keyof typeof sideStyles]}
`

const StyledCloseButton = styled(SheetPrimitive.Close)`
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

  &:disabled {
    pointer-events: none;
  }

  &[data-state='open'] {
    background-color: var(--secondary);
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

const StyledSheetHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem;
`

const StyledSheetFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`

const StyledSheetTitle = styled(SheetPrimitive.Title)`
  color: var(--foreground);
  font-weight: 600;
`

const StyledSheetDescription = styled(SheetPrimitive.Description)`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <StyledSheetOverlay
      data-slot="sheet-overlay"
      className={className}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <StyledSheetContent
        data-slot="sheet-content"
        $side={side}
        className={className}
        {...props}
      >
        {children}
        <StyledCloseButton>
          <XIcon style={{ width: '1rem', height: '1rem' }} />
          <SrOnly>Close</SrOnly>
        </StyledCloseButton>
      </StyledSheetContent>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledSheetHeader
      data-slot="sheet-header"
      className={className}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledSheetFooter
      data-slot="sheet-footer"
      className={className}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <StyledSheetTitle
      data-slot="sheet-title"
      className={className}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <StyledSheetDescription
      data-slot="sheet-description"
      className={className}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

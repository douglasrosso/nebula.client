'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import styled from 'styled-components'

const StyledDrawerOverlay = styled(DrawerPrimitive.Overlay)`
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

const StyledDrawerContent = styled(DrawerPrimitive.Content)`
  background-color: var(--background);
  position: fixed;
  z-index: 50;
  display: flex;
  height: auto;
  flex-direction: column;

  &[data-vaul-drawer-direction='top'] {
    inset-inline: 0;
    top: 0;
    margin-bottom: 6rem;
    max-height: 80vh;
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    border-bottom: 1px solid var(--border);
  }

  &[data-vaul-drawer-direction='bottom'] {
    inset-inline: 0;
    bottom: 0;
    margin-top: 6rem;
    max-height: 80vh;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    border-top: 1px solid var(--border);
  }

  &[data-vaul-drawer-direction='right'] {
    inset-block: 0;
    right: 0;
    width: 75%;
    border-left: 1px solid var(--border);

    @media (min-width: 640px) {
      max-width: 24rem;
    }
  }

  &[data-vaul-drawer-direction='left'] {
    inset-block: 0;
    left: 0;
    width: 75%;
    border-right: 1px solid var(--border);

    @media (min-width: 640px) {
      max-width: 24rem;
    }
  }
`

const DrawerHandle = styled.div`
  background-color: var(--muted);
  margin: 1rem auto 0;
  display: none;
  height: 0.5rem;
  width: 6.25rem;
  flex-shrink: 0;
  border-radius: 9999px;

  [data-vaul-drawer-direction='bottom'] & {
    display: block;
  }
`

const StyledDrawerHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 1rem;

  @media (min-width: 768px) {
    gap: 0.375rem;
    text-align: left;
  }

  [data-vaul-drawer-direction='bottom'] &,
  [data-vaul-drawer-direction='top'] & {
    text-align: center;
  }
`

const StyledDrawerFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`

const StyledDrawerTitle = styled(DrawerPrimitive.Title)`
  color: var(--foreground);
  font-weight: 600;
`

const StyledDrawerDescription = styled(DrawerPrimitive.Description)`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <StyledDrawerOverlay
      data-slot="drawer-overlay"
      className={className}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <StyledDrawerContent
        data-slot="drawer-content"
        className={className}
        {...props}
      >
        <DrawerHandle />
        {children}
      </StyledDrawerContent>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledDrawerHeader
      data-slot="drawer-header"
      className={className}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledDrawerFooter
      data-slot="drawer-footer"
      className={className}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <StyledDrawerTitle
      data-slot="drawer-title"
      className={className}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <StyledDrawerDescription
      data-slot="drawer-description"
      className={className}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}

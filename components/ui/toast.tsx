'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import styled, { css } from 'styled-components'

const ToastProvider = ToastPrimitives.Provider

const StyledToastViewport = styled(ToastPrimitives.Viewport)`
  position: fixed;
  top: 0;
  z-index: 100;
  display: flex;
  max-height: 100vh;
  width: 100%;
  flex-direction: column-reverse;
  padding: 1rem;

  @media (min-width: 640px) {
    bottom: 0;
    right: 0;
    top: auto;
    flex-direction: column;
    max-width: 26.25rem;
  }
`

type ToastVariant = 'default' | 'destructive'

const variantStyles: Record<ToastVariant, ReturnType<typeof css>> = {
  default: css`
    border: 1px solid var(--border);
    background-color: var(--background);
    color: var(--foreground);
  `,
  destructive: css`
    border: 1px solid var(--destructive);
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  `,
}

const StyledToast = styled(ToastPrimitives.Root)<{ $variant?: ToastVariant }>`
  pointer-events: auto;
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  overflow: hidden;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  padding-right: 2rem;
  box-shadow: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1);
  transition: all 150ms;

  &[data-state='open'] {
    animation-name: enter;
    animation-duration: 150ms;
    --tw-enter-translate-y: 100%;
    --tw-enter-opacity: 0;
  }

  &[data-state='closed'] {
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-translate-x: 100%;
    --tw-exit-opacity: 0.8;
  }

  &[data-swipe='cancel'] {
    transform: translateX(0);
  }

  &[data-swipe='end'] {
    transform: translateX(var(--radix-toast-swipe-end-x));
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-translate-x: 100%;
  }

  &[data-swipe='move'] {
    transform: translateX(var(--radix-toast-swipe-move-x));
    transition: none;
  }

  @media (min-width: 640px) {
    &[data-state='open'] {
      --tw-enter-translate-y: 0;
      --tw-enter-translate-x: 0;
    }
  }

  ${({ $variant = 'default' }) => variantStyles[$variant]}
`

const StyledToastAction = styled(ToastPrimitives.Action)`
  display: inline-flex;
  height: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: transparent;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition: colors 150ms;
  cursor: pointer;
  color: inherit;

  &:hover {
    background-color: var(--secondary);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`

const StyledToastClose = styled(ToastPrimitives.Close)`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  border-radius: var(--radius-md);
  padding: 0.25rem;
  color: color-mix(in oklch, currentColor 50%, transparent);
  opacity: 0;
  transition: opacity 150ms;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: inherit;
  }

  &:focus {
    opacity: 1;
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }

  *:hover > & {
    opacity: 1;
  }
`

const StyledToastTitle = styled(ToastPrimitives.Title)`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
`

const StyledToastDescription = styled(ToastPrimitives.Description)`
  font-size: 0.875rem;
  line-height: 1.25rem;
  opacity: 0.9;
`

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <StyledToastViewport ref={ref} className={className} {...props} />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    variant?: ToastVariant
  }
>(({ className, variant, ...props }, ref) => {
  return (
    <StyledToast ref={ref} $variant={variant} className={className} {...props} />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <StyledToastAction ref={ref} className={className} {...props} />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <StyledToastClose ref={ref} className={className} toast-close="" {...props}>
    <X style={{ width: '1rem', height: '1rem' }} />
  </StyledToastClose>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <StyledToastTitle ref={ref} className={className} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <StyledToastDescription ref={ref} className={className} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

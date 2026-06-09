import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDownIcon } from 'lucide-react'
import styled from 'styled-components'

const StyledNavigationMenuRoot = styled(NavigationMenuPrimitive.Root)`
  position: relative;
  display: flex;
  max-width: max-content;
  flex: 1;
  align-items: center;
  justify-content: center;
`

const StyledNavigationMenuList = styled(NavigationMenuPrimitive.List)`
  display: flex;
  flex: 1;
  list-style: none;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
`

const StyledNavigationMenuItem = styled(NavigationMenuPrimitive.Item)`
  position: relative;
`

const triggerStyles = `
  display: inline-flex;
  height: 2.25rem;
  width: max-content;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background-color: var(--background);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  cursor: pointer;
  border: none;
  color: inherit;

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
    outline: 1px solid var(--ring);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state='open'] {
    background-color: color-mix(in oklch, var(--accent) 50%, transparent);
    color: var(--accent-foreground);
  }

  &[data-state='open']:hover,
  &[data-state='open']:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
`

const StyledNavigationMenuTrigger = styled(NavigationMenuPrimitive.Trigger)`
  ${triggerStyles}
  gap: 0.25rem;
`

const StyledChevron = styled(ChevronDownIcon)`
  position: relative;
  top: 1px;
  margin-left: 0.25rem;
  width: 0.75rem;
  height: 0.75rem;
  transition: transform 300ms;

  [data-state='open'] & {
    transform: rotate(180deg);
  }
`

const StyledNavigationMenuContent = styled(NavigationMenuPrimitive.Content)`
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem;
  padding-right: 0.625rem;

  @media (min-width: 768px) {
    position: absolute;
    width: auto;
  }

  &[data-motion^='from-'] {
    animation-name: enter;
    animation-duration: 150ms;
    --tw-enter-opacity: 0;
  }

  &[data-motion^='to-'] {
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-opacity: 0;
  }
`

const StyledNavigationMenuViewportWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  isolation: isolate;
  z-index: 50;
  display: flex;
  justify-content: center;
`

const StyledNavigationMenuViewport = styled(NavigationMenuPrimitive.Viewport)`
  transform-origin: top center;
  background-color: var(--popover);
  color: var(--popover-foreground);
  position: relative;
  margin-top: 0.375rem;
  height: var(--radix-navigation-menu-viewport-height);
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px 0 oklch(0 0 0 / 0.1);

  @media (min-width: 768px) {
    width: var(--radix-navigation-menu-viewport-width);
  }

  &[data-state='open'] {
    animation-name: enter;
    animation-duration: 150ms;
    --tw-enter-scale: 0.95;
  }

  &[data-state='closed'] {
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-scale: 0.95;
  }
`

const StyledNavigationMenuLink = styled(NavigationMenuPrimitive.Link)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-radius: calc(var(--radius) - 4px);
  padding: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 150ms;
  outline: none;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
    outline: 1px solid var(--ring);
  }

  &[data-active='true'] {
    background-color: color-mix(in oklch, var(--accent) 50%, transparent);
    color: var(--accent-foreground);
  }

  &[data-active='true']:focus,
  &[data-active='true']:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }

  & svg:not([class*='text-']) {
    color: var(--muted-foreground);
  }
`

const StyledNavigationMenuIndicator = styled(NavigationMenuPrimitive.Indicator)`
  top: 100%;
  z-index: 1;
  display: flex;
  height: 0.375rem;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;

  &[data-state='visible'] {
    animation-name: enter;
    animation-duration: 150ms;
    --tw-enter-opacity: 0;
  }

  &[data-state='hidden'] {
    animation-name: exit;
    animation-duration: 150ms;
    --tw-exit-opacity: 0;
  }
`

const IndicatorArrow = styled.div`
  background-color: var(--border);
  position: relative;
  top: 60%;
  height: 0.5rem;
  width: 0.5rem;
  transform: rotate(45deg);
  border-radius: 2px 0 0 0;
  box-shadow: 0 4px 6px -1px oklch(0 0 0 / 0.1);
`

// navigationMenuTriggerStyle kept for compatibility
function navigationMenuTriggerStyle() {
  return triggerStyles
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <StyledNavigationMenuRoot
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={className}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </StyledNavigationMenuRoot>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <StyledNavigationMenuList
      data-slot="navigation-menu-list"
      className={className}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <StyledNavigationMenuItem
      data-slot="navigation-menu-item"
      className={className}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <StyledNavigationMenuTrigger
      data-slot="navigation-menu-trigger"
      className={className}
      {...props}
    >
      {children}{' '}
      <StyledChevron aria-hidden="true" />
    </StyledNavigationMenuTrigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <StyledNavigationMenuContent
      data-slot="navigation-menu-content"
      className={className}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <StyledNavigationMenuViewportWrapper>
      <StyledNavigationMenuViewport
        data-slot="navigation-menu-viewport"
        className={className}
        {...props}
      />
    </StyledNavigationMenuViewportWrapper>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <StyledNavigationMenuLink
      data-slot="navigation-menu-link"
      className={className}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <StyledNavigationMenuIndicator
      data-slot="navigation-menu-indicator"
      className={className}
      {...props}
    >
      <IndicatorArrow />
    </StyledNavigationMenuIndicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}

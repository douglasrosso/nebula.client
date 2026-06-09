'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { PanelLeftIcon } from 'lucide-react'
import styled, { css } from 'styled-components'

import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

// ─── Styled Components ────────────────────────────────────────────────────────

const StyledSidebarWrapper = styled.div`
  display: flex;
  min-height: 100svh;
  width: 100%;

  &:has([data-variant='inset']) {
    background-color: var(--sidebar);
  }
`

const StyledSidebarNone = styled.div`
  background-color: var(--sidebar);
  color: var(--sidebar-foreground);
  display: flex;
  height: 100%;
  width: var(--sidebar-width);
  flex-direction: column;
`

const StyledSidebarGap = styled.div<{ $variant?: string; $state?: string; $collapsible?: string; $side?: string }>`
  position: relative;
  width: var(--sidebar-width);
  background-color: transparent;
  transition: width 200ms ease-linear;

  ${({ $state, $collapsible }) =>
    $state === 'collapsed' && $collapsible === 'offcanvas'
      ? css`width: 0;`
      : ''}

  ${({ $side }) =>
    $side === 'right'
      ? css`transform: rotate(180deg);`
      : ''}

  ${({ $variant, $state, $collapsible }) =>
    ($variant === 'floating' || $variant === 'inset') && $state === 'collapsed' && $collapsible === 'icon'
      ? css`width: calc(var(--sidebar-width-icon) + 1rem);`
      : $state === 'collapsed' && $collapsible === 'icon'
      ? css`width: var(--sidebar-width-icon);`
      : ''}
`

const StyledSidebarContainer = styled.div<{ $side?: string; $variant?: string; $state?: string; $collapsible?: string }>`
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 10;
  display: none;
  height: 100svh;
  width: var(--sidebar-width);
  transition: left 200ms ease-linear, right 200ms ease-linear, width 200ms ease-linear;

  @media (min-width: 768px) {
    display: flex;
  }

  ${({ $side, $state, $collapsible }) =>
    $side === 'left'
      ? css`
          left: 0;
          ${$state === 'collapsed' && $collapsible === 'offcanvas'
            ? css`left: calc(var(--sidebar-width) * -1);`
            : ''}
        `
      : css`
          right: 0;
          ${$state === 'collapsed' && $collapsible === 'offcanvas'
            ? css`right: calc(var(--sidebar-width) * -1);`
            : ''}
        `}

  ${({ $variant, $state, $collapsible }) =>
    $variant === 'floating' || $variant === 'inset'
      ? css`
          padding: 0.5rem;
          ${$state === 'collapsed' && $collapsible === 'icon'
            ? css`width: calc(var(--sidebar-width-icon) + 1rem + 2px);`
            : ''}
        `
      : css`
          ${$state === 'collapsed' && $collapsible === 'icon'
            ? css`width: var(--sidebar-width-icon);`
            : ''}
          ${$side === 'left'
            ? css`border-right: 1px solid var(--border);`
            : css`border-left: 1px solid var(--border);`}
        `}
`

const StyledSidebarInner = styled.div<{ $variant?: string }>`
  background-color: var(--sidebar);
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;

  ${({ $variant }) =>
    $variant === 'floating'
      ? css`
          border-radius: var(--radius-lg);
          border: 1px solid var(--sidebar-border);
          box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
        `
      : ''}
`

const StyledSidebarTriggerButton = styled(Button)`
  width: 1.75rem;
  height: 1.75rem;
`

const StyledSidebarRail = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 20;
  display: none;
  width: 1rem;
  transform: translateX(-50%);
  transition: all 200ms ease-linear;
  cursor: w-resize;

  @media (min-width: 640px) {
    display: flex;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background-color: transparent;
    transition: background-color 200ms;
  }

  &:hover::after {
    background-color: var(--sidebar-border);
  }
`

const StyledSidebarInset = styled.main`
  background-color: var(--background);
  position: relative;
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;

  @media (min-width: 768px) {
    /* inset variant styles handled via data-variant on peer */
  }
`

const StyledSidebarInput = styled(Input)`
  background-color: var(--background);
  height: 2rem;
  width: 100%;
  box-shadow: none;
`

const StyledSidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
`

const StyledSidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
`

const StyledSidebarSeparator = styled(Separator)`
  background-color: var(--sidebar-border);
  margin: 0 0.5rem;
  width: auto;
`

const StyledSidebarContent = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  overflow: auto;

  [data-collapsible='icon'] & {
    overflow: hidden;
  }
`

const StyledSidebarGroup = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  padding: 0.5rem;
`

const StyledSidebarGroupLabel = styled.div`
  color: color-mix(in oklch, var(--sidebar-foreground) 70%, transparent);
  display: flex;
  height: 2rem;
  flex-shrink: 0;
  align-items: center;
  border-radius: var(--radius-md);
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  outline: none;
  transition: margin 200ms ease-linear, opacity 200ms ease-linear;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--sidebar-ring);
  }

  & > svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  [data-collapsible='icon'] & {
    margin-top: -2rem;
    opacity: 0;
  }
`

const StyledSidebarGroupAction = styled.button`
  color: var(--sidebar-foreground);
  position: absolute;
  top: 0.875rem;
  right: 0.75rem;
  display: flex;
  aspect-ratio: 1;
  width: 1.25rem;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  padding: 0;
  outline: none;
  transition: transform 200ms;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--sidebar-ring);
  }

  &:hover {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  & > svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  /* Increases hit area on mobile */
  &::after {
    content: '';
    position: absolute;
    inset: -0.5rem;
  }

  @media (min-width: 768px) {
    &::after {
      display: none;
    }
  }

  [data-collapsible='icon'] & {
    display: none;
  }
`

const StyledSidebarGroupContent = styled.div`
  width: 100%;
  font-size: 0.875rem;
`

const StyledSidebarMenu = styled.ul`
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
`

const StyledSidebarMenuItem = styled.li`
  position: relative;
`

type SidebarMenuButtonVariant = 'default' | 'outline'
type SidebarMenuButtonSize = 'default' | 'sm' | 'lg'

const menuButtonVariantStyles: Record<SidebarMenuButtonVariant, ReturnType<typeof css>> = {
  default: css`
    &:hover {
      background-color: var(--sidebar-accent);
      color: var(--sidebar-accent-foreground);
    }
  `,
  outline: css`
    background-color: var(--background);
    box-shadow: 0 0 0 1px var(--sidebar-border);

    &:hover {
      background-color: var(--sidebar-accent);
      color: var(--sidebar-accent-foreground);
      box-shadow: 0 0 0 1px var(--sidebar-accent);
    }
  `,
}

const menuButtonSizeStyles: Record<SidebarMenuButtonSize, ReturnType<typeof css>> = {
  default: css`height: 2rem; font-size: 0.875rem;`,
  sm: css`height: 1.75rem; font-size: 0.75rem;`,
  lg: css`
    height: 3rem;
    font-size: 0.875rem;

    [data-collapsible='icon'] & {
      padding: 0 !important;
    }
  `,
}

const StyledSidebarMenuButton = styled.button<{
  $variant?: SidebarMenuButtonVariant
  $size?: SidebarMenuButtonSize
}>`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  text-align: left;
  font-size: 0.875rem;
  outline: none;
  transition: width 200ms ease-linear, height 200ms ease-linear, padding 200ms ease-linear;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--sidebar-ring);
  }

  &:hover {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  &:active {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  &:disabled,
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-active='true'] {
    background-color: var(--sidebar-accent);
    font-weight: 500;
    color: var(--sidebar-accent-foreground);
  }

  &[data-state='open']:hover {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  /* When sidebar has menu-action, add padding to avoid overlap */
  [data-sidebar='menu-item']:has([data-sidebar='menu-action']) & {
    padding-right: 2rem;
  }

  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  [data-collapsible='icon'] & {
    width: 2rem !important;
    height: 2rem !important;
    padding: 0.5rem !important;
  }

  ${({ $variant = 'default' }) => menuButtonVariantStyles[$variant]}
  ${({ $size = 'default' }) => menuButtonSizeStyles[$size]}
`

const StyledSidebarMenuAction = styled.button<{ $showOnHover?: boolean }>`
  color: var(--sidebar-foreground);
  position: absolute;
  top: 0.375rem;
  right: 0.25rem;
  display: flex;
  aspect-ratio: 1;
  width: 1.25rem;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  padding: 0;
  outline: none;
  transition: transform 200ms;
  background: none;
  border: none;
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--sidebar-ring);
  }

  &:hover {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  /* peer button size offsets */
  [data-size='sm'] ~ & { top: 0.25rem; }
  [data-size='default'] ~ & { top: 0.375rem; }
  [data-size='lg'] ~ & { top: 0.625rem; }

  & > svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  /* Increases hit area on mobile */
  &::after {
    content: '';
    position: absolute;
    inset: -0.5rem;
  }

  @media (min-width: 768px) {
    &::after {
      display: none;
    }
  }

  [data-collapsible='icon'] & {
    display: none;
  }

  ${({ $showOnHover }) =>
    $showOnHover
      ? css`
          @media (min-width: 768px) {
            opacity: 0;
          }

          [data-sidebar='menu-item']:focus-within &,
          [data-sidebar='menu-item']:hover &,
          &[data-state='open'] {
            opacity: 1;
          }
        `
      : ''}
`

const StyledSidebarMenuBadge = styled.div`
  color: var(--sidebar-foreground);
  pointer-events: none;
  position: absolute;
  right: 0.25rem;
  display: flex;
  height: 1.25rem;
  min-width: 1.25rem;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  padding: 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  user-select: none;

  /* peer button size offsets */
  [data-size='sm'] ~ & { top: 0.25rem; }
  [data-size='default'] ~ & { top: 0.375rem; }
  [data-size='lg'] ~ & { top: 0.625rem; }

  [data-collapsible='icon'] & {
    display: none;
  }
`

const StyledSidebarMenuSkeletonWrapper = styled.div`
  display: flex;
  height: 2rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--radius-md);
  padding: 0 0.5rem;
`

const StyledSidebarMenuSub = styled.ul`
  border-left: 1px solid var(--sidebar-border);
  margin: 0 0.875rem;
  display: flex;
  min-width: 0;
  transform: translateX(1px);
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.125rem 0.625rem;
  list-style: none;

  [data-collapsible='icon'] & {
    display: none;
  }
`

const StyledSidebarMenuSubItem = styled.li`
  position: relative;
`

const StyledSidebarMenuSubButton = styled.a<{ $size?: 'sm' | 'md'; $isActive?: boolean }>`
  color: var(--sidebar-foreground);
  display: flex;
  height: 1.75rem;
  min-width: 0;
  transform: translateX(-1px);
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  border-radius: var(--radius-md);
  padding: 0 0.5rem;
  outline: none;
  text-decoration: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--sidebar-ring);
  }

  &:hover {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  &:active {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  &:disabled,
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-active='true'] {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > svg {
    color: var(--sidebar-accent-foreground);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  [data-collapsible='icon'] & {
    display: none;
  }

  ${({ $size = 'md' }) =>
    $size === 'sm'
      ? css`font-size: 0.75rem;`
      : css`font-size: 0.875rem;`}
`

// ─── Components ───────────────────────────────────────────────────────────────

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <StyledSidebarWrapper
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={className}
          {...props}
        >
          {children}
        </StyledSidebarWrapper>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <StyledSidebarNone
        data-slot="sidebar"
        className={className}
        {...props}
      >
        {children}
      </StyledSidebarNone>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
              backgroundColor: 'var(--sidebar)',
              color: 'var(--sidebar-foreground)',
              width: 'var(--sidebar-width)',
              padding: 0,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      style={{ color: 'var(--sidebar-foreground)', display: 'none' }}
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <StyledSidebarGap
        data-slot="sidebar-gap"
        $variant={variant}
        $state={state}
        $collapsible={state === 'collapsed' ? collapsible : ''}
        $side={side}
      />
      <StyledSidebarContainer
        data-slot="sidebar-container"
        $side={side}
        $variant={variant}
        $state={state}
        $collapsible={state === 'collapsed' ? collapsible : ''}
        className={className}
        {...props}
      >
        <StyledSidebarInner
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          $variant={variant}
        >
          {children}
        </StyledSidebarInner>
      </StyledSidebarContainer>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <StyledSidebarTriggerButton
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={className}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </StyledSidebarTriggerButton>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <StyledSidebarRail
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={className}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <StyledSidebarInset
      data-slot="sidebar-inset"
      className={className}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <StyledSidebarInput
      data-slot="sidebar-input"
      data-sidebar="input"
      className={className}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledSidebarHeader
      data-slot="sidebar-header"
      data-sidebar="header"
      className={className}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledSidebarFooter
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={className}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <StyledSidebarSeparator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={className}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledSidebarContent
      data-slot="sidebar-content"
      data-sidebar="content"
      className={className}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledSidebarGroup
      data-slot="sidebar-group"
      data-sidebar="group"
      className={className}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <StyledSidebarGroupLabel
      as={Comp}
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={className}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <StyledSidebarGroupAction
      as={Comp}
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={className}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <StyledSidebarGroupContent
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={className}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <StyledSidebarMenu
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={className}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <StyledSidebarMenuItem
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={className}
      {...props}
    />
  )
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  isActive?: boolean
  variant?: SidebarMenuButtonVariant
  size?: SidebarMenuButtonSize
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
}) {
  const Comp = asChild ? Slot : 'button'
  const { isMobile, state } = useSidebar()

  const button = (
    <StyledSidebarMenuButton
      as={Comp}
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : 'button'

  return (
    <StyledSidebarMenuAction
      as={Comp}
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      $showOnHover={showOnHover}
      className={className}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <StyledSidebarMenuBadge
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={className}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean
}) {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <StyledSidebarMenuSkeletonWrapper
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={className}
      {...props}
    >
      {showIcon && (
        <Skeleton
          style={{ width: '1rem', height: '1rem', borderRadius: 'var(--radius-md)' }}
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        style={{ height: '1rem', maxWidth: width, flex: 1 } as React.CSSProperties}
        data-sidebar="menu-skeleton-text"
      />
    </StyledSidebarMenuSkeletonWrapper>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <StyledSidebarMenuSub
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={className}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <StyledSidebarMenuSubItem
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={className}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
  size?: 'sm' | 'md'
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : 'a'

  return (
    <StyledSidebarMenuSubButton
      as={Comp}
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      $size={size}
      $isActive={isActive}
      className={className}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

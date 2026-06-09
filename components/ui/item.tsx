import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import styled, { css } from 'styled-components'

import { Separator } from '@/components/ui/separator'

const StyledItemGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledItemSeparator = styled(Separator)`
  margin: 0;
`

type ItemVariant = 'default' | 'outline' | 'muted'
type ItemSize = 'default' | 'sm'

const variantStyles: Record<ItemVariant, ReturnType<typeof css>> = {
  default: css`background-color: transparent;`,
  outline: css`border-color: var(--border);`,
  muted: css`background-color: color-mix(in oklch, var(--muted) 50%, transparent);`,
}

const sizeStyles: Record<ItemSize, ReturnType<typeof css>> = {
  default: css`padding: 1rem; gap: 1rem;`,
  sm: css`padding: 0.75rem 1rem; gap: 0.625rem;`,
}

const StyledItem = styled.div<{ $variant?: ItemVariant; $size?: ItemSize }>`
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  font-size: 0.875rem;
  border-radius: var(--radius-md);
  transition: background-color 100ms;
  flex-wrap: wrap;
  outline: none;

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  ${({ $variant = 'default' }) => variantStyles[$variant]}
  ${({ $size = 'default' }) => sizeStyles[$size]}
`

const StyledItemMedia = styled.div<{ $variant?: string }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  & svg { pointer-events: none; }

  ${({ $variant = 'default' }) => {
    if ($variant === 'icon') return css`
      width: 2rem; height: 2rem;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      background-color: var(--muted);
      & svg { width: 1rem; height: 1rem; }
    `
    if ($variant === 'image') return css`
      width: 2.5rem; height: 2.5rem;
      border-radius: 0.25rem;
      overflow: hidden;
      & img { width: 100%; height: 100%; object-fit: cover; }
    `
    return css`background-color: transparent;`
  }}
`

const StyledItemContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
`

const StyledItemTitle = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.375;
  font-weight: 500;
`

const StyledItemDescription = styled.p`
  color: var(--muted-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.875rem;
  line-height: normal;
  font-weight: normal;
  text-wrap: balance;

  & > a { text-decoration: underline; text-underline-offset: 4px; }
  & > a:hover { color: var(--primary); }
`

const StyledItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StyledItemHeader = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

const StyledItemFooter = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

function ItemGroup({ ...props }: React.ComponentProps<'div'>) {
  return <StyledItemGroup role="list" data-slot="item-group" {...props} />
}

function ItemSeparator({ ...props }: React.ComponentProps<typeof Separator>) {
  return <StyledItemSeparator data-slot="item-separator" orientation="horizontal" {...props} />
}

function Item({
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  { variant?: ItemVariant; size?: ItemSize; asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
  return (
    <StyledItem
      as={Comp}
      data-slot="item"
      data-variant={variant}
      data-size={size}
      $variant={variant}
      $size={size}
      {...props}
    />
  )
}

function ItemMedia({
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & { variant?: 'default' | 'icon' | 'image' }) {
  return (
    <StyledItemMedia
      data-slot="item-media"
      data-variant={variant}
      $variant={variant}
      {...props}
    />
  )
}

function ItemContent({ ...props }: React.ComponentProps<'div'>) {
  return <StyledItemContent data-slot="item-content" {...props} />
}

function ItemTitle({ ...props }: React.ComponentProps<'div'>) {
  return <StyledItemTitle data-slot="item-title" {...props} />
}

function ItemDescription({ ...props }: React.ComponentProps<'p'>) {
  return <StyledItemDescription data-slot="item-description" {...props} />
}

function ItemActions({ ...props }: React.ComponentProps<'div'>) {
  return <StyledItemActions data-slot="item-actions" {...props} />
}

function ItemHeader({ ...props }: React.ComponentProps<'div'>) {
  return <StyledItemHeader data-slot="item-header" {...props} />
}

function ItemFooter({ ...props }: React.ComponentProps<'div'>) {
  return <StyledItemFooter data-slot="item-footer" {...props} />
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}

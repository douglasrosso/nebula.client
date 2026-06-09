'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import styled from 'styled-components'

const StyledAvatarRoot = styled(AvatarPrimitive.Root)`
  position: relative;
  display: flex;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
`

const StyledAvatarImage = styled(AvatarPrimitive.Image)`
  aspect-ratio: 1 / 1;
  width: 100%;
  height: 100%;
`

const StyledAvatarFallback = styled(AvatarPrimitive.Fallback)`
  background-color: var(--muted);
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
`

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <StyledAvatarRoot
      data-slot="avatar"
      className={className}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <StyledAvatarImage
      data-slot="avatar-image"
      className={className}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <StyledAvatarFallback
      data-slot="avatar-fallback"
      className={className}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }

import * as React from 'react'
import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

const StyledSkeleton = styled.div`
  background-color: var(--accent);
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: var(--radius-md);
`

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledSkeleton
      data-slot="skeleton"
      className={className}
      {...props}
    />
  )
}

export { Skeleton }

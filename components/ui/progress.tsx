'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import styled from 'styled-components'

const StyledProgressRoot = styled(ProgressPrimitive.Root)`
  background-color: color-mix(in oklch, var(--primary) 20%, transparent);
  position: relative;
  height: 0.5rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
`

const StyledProgressIndicator = styled(ProgressPrimitive.Indicator)`
  background-color: var(--primary);
  height: 100%;
  width: 100%;
  flex: 1;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
`

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <StyledProgressRoot
      data-slot="progress"
      className={className}
      {...props}
    >
      <StyledProgressIndicator
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </StyledProgressRoot>
  )
}

export { Progress }

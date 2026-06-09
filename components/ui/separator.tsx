'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import styled from 'styled-components'

const StyledSeparator = styled(SeparatorPrimitive.Root)`
  flex-shrink: 0;
  background-color: var(--border);

  &[data-orientation='horizontal'] {
    height: 1px;
    width: 100%;
  }

  &[data-orientation='vertical'] {
    height: 100%;
    width: 1px;
  }
`

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <StyledSeparator
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={className}
      {...props}
    />
  )
}

export { Separator }

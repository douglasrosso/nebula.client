'use client'

import * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'
import styled from 'styled-components'

const StyledPanelGroup = styled(ResizablePrimitive.PanelGroup)`
  display: flex;
  height: 100%;
  width: 100%;

  &[data-panel-group-direction='vertical'] {
    flex-direction: column;
  }
`

const StyledPanelResizeHandle = styled(ResizablePrimitive.PanelResizeHandle)`
  background-color: var(--border);
  position: relative;
  display: flex;
  width: 1px;
  align-items: center;
  justify-content: center;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 0.25rem;
    transform: translateX(-50%);
  }

  &:focus-visible {
    box-shadow: 0 0 0 1px var(--ring);
    outline: none;
  }

  &[data-panel-group-direction='vertical'] {
    height: 1px;
    width: 100%;

    &::after {
      left: 0;
      top: 50%;
      height: 0.25rem;
      width: 100%;
      transform: translateX(0) translateY(-50%);
    }
  }

  &[data-panel-group-direction='vertical'] > div {
    transform: rotate(90deg);
  }
`

const StyledHandleInner = styled.div`
  background-color: var(--border);
  z-index: 10;
  display: flex;
  height: 1rem;
  width: 0.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid var(--border);
`

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <StyledPanelGroup
      data-slot="resizable-panel-group"
      className={className}
      {...props}
    />
  )
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <StyledPanelResizeHandle
      data-slot="resizable-handle"
      className={className}
      {...props}
    >
      {withHandle && (
        <StyledHandleInner>
          <GripVerticalIcon style={{ width: '0.625rem', height: '0.625rem' }} />
        </StyledHandleInner>
      )}
    </StyledPanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

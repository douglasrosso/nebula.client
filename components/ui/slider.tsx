'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import styled from 'styled-components'

const StyledSliderRoot = styled(SliderPrimitive.Root)`
  position: relative;
  display: flex;
  width: 100%;
  touch-action: none;
  align-items: center;
  user-select: none;

  &[data-disabled] {
    opacity: 0.5;
  }

  &[data-orientation='vertical'] {
    height: 100%;
    min-height: 11rem;
    width: auto;
    flex-direction: column;
  }
`

const StyledSliderTrack = styled(SliderPrimitive.Track)`
  background-color: var(--muted);
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 9999px;

  &[data-orientation='horizontal'] {
    height: 0.375rem;
    width: 100%;
  }

  &[data-orientation='vertical'] {
    height: 100%;
    width: 0.375rem;
  }
`

const StyledSliderRange = styled(SliderPrimitive.Range)`
  background-color: var(--primary);
  position: absolute;

  &[data-orientation='horizontal'] {
    height: 100%;
  }

  &[data-orientation='vertical'] {
    width: 100%;
  }
`

const StyledSliderThumb = styled(SliderPrimitive.Thumb)`
  border: 1px solid var(--primary);
  background-color: white;
  display: block;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.1);
  transition: color 150ms, box-shadow 150ms;
  outline: none;

  &:hover {
    box-shadow: 0 0 0 4px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px color-mix(in oklch, var(--ring) 50%, transparent);
    outline: none;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  )

  return (
    <StyledSliderRoot
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={className}
      {...props}
    >
      <StyledSliderTrack data-slot="slider-track">
        <StyledSliderRange data-slot="slider-range" />
      </StyledSliderTrack>
      {Array.from({ length: _values.length }, (_, index) => (
        <StyledSliderThumb data-slot="slider-thumb" key={index} />
      ))}
    </StyledSliderRoot>
  )
}

export { Slider }

import * as React from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  height: 2.25rem;
  width: 100%;
  min-width: 0;
  border-radius: var(--radius-md);
  border: 1px solid var(--input);
  background-color: transparent;
  padding: 0.25rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  color: inherit;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &::selection {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[aria-invalid='true'] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
  }

  &[type='file'] {
    display: inline-flex;
    border: none;
    background-color: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
    padding: 0;
    height: auto;
    min-height: 1.75rem;
  }

  @media (min-width: 768px) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
`

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <StyledInput
      type={type}
      data-slot="input"
      className={className}
      {...props}
    />
  )
}

export { Input }

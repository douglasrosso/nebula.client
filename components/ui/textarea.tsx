import * as React from 'react'
import styled from 'styled-components'

const StyledTextarea = styled.textarea`
  border: 1px solid var(--input);
  display: flex;
  field-sizing: content;
  min-height: 4rem;
  width: 100%;
  border-radius: var(--radius-md);
  background-color: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  color: inherit;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &[aria-invalid='true'] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 768px) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
`

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <StyledTextarea
      data-slot="textarea"
      className={className}
      {...props}
    />
  )
}

export { Textarea }

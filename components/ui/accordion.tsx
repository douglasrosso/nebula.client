'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import styled from 'styled-components'

const StyledAccordionItem = styled(AccordionPrimitive.Item)`
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
`

const StyledAccordionHeader = styled(AccordionPrimitive.Header)`
  display: flex;
`

const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger)`
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  border-radius: var(--radius-md);
  padding: 1rem 0;
  text-align: left;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state='open'] > svg {
    transform: rotate(180deg);
  }
`

const StyledChevron = styled(ChevronDownIcon)`
  color: var(--muted-foreground);
  pointer-events: none;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  transform: translateY(0.125rem);
  transition: transform 200ms;
`

const StyledAccordionContent = styled(AccordionPrimitive.Content)`
  overflow: hidden;
  font-size: 0.875rem;
  line-height: 1.25rem;

  &[data-state='closed'] {
    animation: accordion-up 0.2s ease-out;
  }

  &[data-state='open'] {
    animation: accordion-down 0.2s ease-out;
  }
`

const StyledAccordionContentInner = styled.div`
  padding-top: 0;
  padding-bottom: 1rem;
`

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <StyledAccordionItem
      data-slot="accordion-item"
      className={className}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <StyledAccordionHeader>
      <StyledAccordionTrigger
        data-slot="accordion-trigger"
        className={className}
        {...props}
      >
        {children}
        <StyledChevron />
      </StyledAccordionTrigger>
    </StyledAccordionHeader>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <StyledAccordionContent
      data-slot="accordion-content"
      {...props}
    >
      <StyledAccordionContentInner className={className}>{children}</StyledAccordionContentInner>
    </StyledAccordionContent>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

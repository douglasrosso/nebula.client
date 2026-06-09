'use client'

import styled, { css } from 'styled-components'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const StyledInputGroup = styled.div`
  border: 1px solid var(--input);
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  border-radius: var(--radius-md);
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: color 150ms, box-shadow 150ms;
  outline: none;
  height: 2.25rem;
  background-color: var(--background);

  &:has(textarea) { height: auto; }

  &:has([data-slot="input-group-control"]:focus-visible) {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  }

  &:has([data-slot][aria-invalid="true"]) {
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 20%, transparent);
    border-color: var(--destructive);
  }
`

type AddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end'

const addonAlignStyles: Record<AddonAlign, ReturnType<typeof css>> = {
  'inline-start': css`order: -1; padding-left: 0.75rem;`,
  'inline-end': css`order: 1; padding-right: 0.75rem;`,
  'block-start': css`
    order: -1; width: 100%; justify-content: flex-start;
    padding: 0.75rem 0.75rem 0 0.75rem;
  `,
  'block-end': css`
    order: 1; width: 100%; justify-content: flex-start;
    padding: 0 0.75rem 0.75rem 0.75rem;
  `,
}

const StyledInputGroupAddon = styled.div<{ $align?: AddonAlign }>`
  color: var(--muted-foreground);
  display: flex;
  height: auto;
  cursor: text;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;

  & > svg { pointer-events: none; width: 1rem; height: 1rem; }

  ${({ $align = 'inline-start' }) => addonAlignStyles[$align]}
`

const StyledInputGroupButton = styled(Button)`
  font-size: 0.875rem;
  box-shadow: none;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  height: 1.5rem;
  gap: 0.25rem;
  padding: 0 0.5rem;
  border-radius: calc(var(--radius-md) - 3px);

  & > svg { pointer-events: none; width: 0.875rem; height: 0.875rem; }
`

const StyledInputGroupText = styled.span`
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  & svg { pointer-events: none; width: 1rem; height: 1rem; }
`

const StyledInputGroupInput = styled(Input)`
  flex: 1;
  border-radius: 0;
  border: 0;
  background-color: transparent;
  box-shadow: none;

  &:focus-visible { box-shadow: none; }
`

const StyledInputGroupTextarea = styled(Textarea)`
  flex: 1;
  resize: none;
  border-radius: 0;
  border: 0;
  background-color: transparent;
  padding: 0.75rem 0;
  box-shadow: none;

  &:focus-visible { box-shadow: none; }
`

function InputGroup({ ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledInputGroup
      data-slot="input-group"
      role="group"
      {...props}
    />
  )
}

function InputGroupAddon({
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & { align?: AddonAlign }) {
  return (
    <StyledInputGroupAddon
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      $align={align}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) return
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

function InputGroupButton({
  type = 'button',
  variant = 'ghost',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <StyledInputGroupButton
      type={type}
      variant={variant}
      {...props}
    />
  )
}

function InputGroupText({ ...props }: React.ComponentProps<'span'>) {
  return <StyledInputGroupText {...props} />
}

function InputGroupInput({ ...props }: React.ComponentProps<'input'>) {
  return (
    <StyledInputGroupInput
      data-slot="input-group-control"
      {...props}
    />
  )
}

function InputGroupTextarea({ ...props }: React.ComponentProps<'textarea'>) {
  return (
    <StyledInputGroupTextarea
      data-slot="input-group-control"
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}

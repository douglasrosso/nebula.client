import { Slot } from '@radix-ui/react-slot'
import styled, { css } from 'styled-components'

import { Separator } from '@/components/ui/separator'

type ButtonGroupOrientation = 'horizontal' | 'vertical'

const StyledButtonGroup = styled.div<{ $orientation?: ButtonGroupOrientation }>`
  display: flex;
  width: fit-content;
  align-items: stretch;

  & > * { flex-shrink: 0; }
  & > *:focus-visible { z-index: 10; position: relative; }

  ${({ $orientation = 'horizontal' }) =>
    $orientation === 'vertical'
      ? css`
          flex-direction: column;
          & > *:not(:first-child) { border-top-left-radius: 0; border-top-right-radius: 0; border-top: 0; }
          & > *:not(:last-child) { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
        `
      : css`
          & > *:not(:first-child) { border-top-left-radius: 0; border-bottom-left-radius: 0; border-left: 0; }
          & > *:not(:last-child) { border-top-right-radius: 0; border-bottom-right-radius: 0; }
        `}
`

const StyledButtonGroupText = styled.div`
  background-color: var(--muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);

  & svg { pointer-events: none; width: 1rem; height: 1rem; }
`

const StyledButtonGroupSeparator = styled(Separator)`
  background-color: var(--input);
  position: relative;
  margin: 0 !important;
  align-self: stretch;
`

function ButtonGroup({
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<'div'> & { orientation?: ButtonGroupOrientation }) {
  return (
    <StyledButtonGroup
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      $orientation={orientation}
      {...props}
    />
  )
}

function ButtonGroupText({
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
  return <StyledButtonGroupText as={Comp} {...props} />
}

function ButtonGroupSeparator({
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <StyledButtonGroupSeparator
      data-slot="button-group-separator"
      orientation={orientation}
      {...props}
    />
  )
}

function buttonGroupVariants({ orientation }: { orientation?: ButtonGroupOrientation } = {}) {
  return `button-group-${orientation ?? 'horizontal'}`
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}

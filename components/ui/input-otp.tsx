'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'
import styled, { keyframes } from 'styled-components'

const caretBlink = keyframes`
  0%, 70%, 100% { opacity: 1; }
  20%, 50% { opacity: 0; }
`

const StyledOTPInput = styled(OTPInput)`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:has(input:disabled) { opacity: 0.5; }
  & input:disabled { cursor: not-allowed; }
`

const StyledInputOTPGroup = styled.div`
  display: flex;
  align-items: center;
`

const StyledInputOTPSlot = styled.div<{ $isActive?: boolean }>`
  border: 1px solid var(--input);
  position: relative;
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  transition: all 150ms;
  outline: none;

  &:first-child {
    border-left-width: 1px;
    border-radius: var(--radius-md) 0 0 var(--radius-md);
  }

  &:last-child {
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    z-index: 10;
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
  `}

  &[aria-invalid='true'] {
    border-color: var(--destructive);
  }
`

const FakeCaretWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FakeCaret = styled.div`
  background-color: var(--foreground);
  height: 1rem;
  width: 1px;
  animation: ${caretBlink} 1s ease-out infinite;
  animation-duration: 1s;
`

function InputOTP({
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <StyledOTPInput
      data-slot="input-otp"
      containerClassName={containerClassName}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <StyledInputOTPGroup
      data-slot="input-otp-group"
      className={className}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <StyledInputOTPSlot
      data-slot="input-otp-slot"
      data-active={isActive}
      $isActive={isActive}
      className={className}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <FakeCaretWrapper>
          <FakeCaret />
        </FakeCaretWrapper>
      )}
    </StyledInputOTPSlot>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

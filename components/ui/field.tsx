'use client'

import { useMemo } from 'react'
import styled from 'styled-components'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const StyledFieldSet = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const StyledFieldLegend = styled.legend<{ $variant?: 'legend' | 'label' }>`
  margin-bottom: 0.75rem;
  font-weight: 500;
  font-size: ${({ $variant = 'legend' }) => $variant === 'label' ? '0.875rem' : '1rem'};
`

const StyledFieldGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1.75rem;
`

const StyledField = styled.div<{ $orientation?: 'vertical' | 'horizontal' | 'responsive' }>`
  display: flex;
  width: 100%;
  gap: 0.75rem;
  flex-direction: ${({ $orientation = 'vertical' }) =>
    $orientation === 'horizontal' ? 'row' : 'column'};

  ${({ $orientation = 'vertical' }) =>
    $orientation === 'horizontal' ? `align-items: center;` : ''}

  &[data-invalid="true"] { color: var(--destructive); }
`

const StyledFieldContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.375rem;
  line-height: 1.375;
`

const StyledFieldLabel = styled(Label)`
  display: flex;
  width: fit-content;
  gap: 0.5rem;
  line-height: 1.375;

  [data-disabled="true"] & { opacity: 0.5; }
`

const StyledFieldTitle = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.375;
  font-weight: 500;

  [data-disabled="true"] & { opacity: 0.5; }
`

const StyledFieldDescription = styled.p`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: normal;
  font-weight: normal;

  & > a { text-decoration: underline; text-underline-offset: 4px; }
  & > a:hover { color: var(--primary); }
`

const StyledFieldSeparatorWrapper = styled.div`
  position: relative;
  height: 1.25rem;
  margin: -0.5rem 0;
  font-size: 0.875rem;
`

const StyledFieldSeparatorContent = styled.span`
  background-color: var(--background);
  color: var(--muted-foreground);
  position: relative;
  display: block;
  width: fit-content;
  margin: 0 auto;
  padding: 0 0.5rem;
`

const StyledFieldError = styled.div`
  color: var(--destructive);
  font-size: 0.875rem;
  font-weight: normal;
`

const ErrorList = styled.ul`
  margin-left: 1rem;
  display: flex;
  list-style: disc;
  flex-direction: column;
  gap: 0.25rem;
`

function FieldSet({ ...props }: React.ComponentProps<'fieldset'>) {
  return <StyledFieldSet data-slot="field-set" {...props} />
}

function FieldLegend({
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <StyledFieldLegend
      data-slot="field-legend"
      data-variant={variant}
      $variant={variant}
      {...props}
    />
  )
}

function FieldGroup({ ...props }: React.ComponentProps<'div'>) {
  return <StyledFieldGroup data-slot="field-group" {...props} />
}

function Field({
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' | 'responsive' }) {
  return (
    <StyledField
      role="group"
      data-slot="field"
      data-orientation={orientation}
      $orientation={orientation}
      {...props}
    />
  )
}

function FieldContent({ ...props }: React.ComponentProps<'div'>) {
  return <StyledFieldContent data-slot="field-content" {...props} />
}

function FieldLabel({ ...props }: React.ComponentProps<typeof Label>) {
  return <StyledFieldLabel data-slot="field-label" {...props} />
}

function FieldTitle({ ...props }: React.ComponentProps<'div'>) {
  return <StyledFieldTitle data-slot="field-label" {...props} />
}

function FieldDescription({ ...props }: React.ComponentProps<'p'>) {
  return <StyledFieldDescription data-slot="field-description" {...props} />
}

function FieldSeparator({
  children,
  ...props
}: React.ComponentProps<'div'> & { children?: React.ReactNode }) {
  return (
    <StyledFieldSeparatorWrapper
      data-slot="field-separator"
      data-content={!!children}
      {...props}
    >
      <Separator style={{ position: 'absolute', inset: 0, top: '50%' }} />
      {children && (
        <StyledFieldSeparatorContent data-slot="field-separator-content">
          {children}
        </StyledFieldSeparatorContent>
      )}
    </StyledFieldSeparatorWrapper>
  )
}

function FieldError({
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) return children
    if (!errors) return null

    if (errors.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ErrorList>
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ErrorList>
    )
  }, [children, errors])

  if (!content) return null

  return (
    <StyledFieldError role="alert" data-slot="field-error" {...props}>
      {content}
    </StyledFieldError>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}

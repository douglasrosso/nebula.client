import styled, { css } from 'styled-components'

const StyledEmpty = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  border-radius: 0.5rem;
  border: 1px dashed var(--border);
  padding: 1.5rem;
  text-align: center;
  text-wrap: balance;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`

const StyledEmptyHeader = styled.div`
  display: flex;
  max-width: 24rem;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`

const mediaVariantStyles: Record<string, ReturnType<typeof css>> = {
  default: css`background-color: transparent;`,
  icon: css`
    background-color: var(--muted);
    color: var(--foreground);
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    & svg { width: 1.5rem; height: 1.5rem; }
  `,
}

const StyledEmptyMedia = styled.div<{ $variant?: string }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  pointer-events: none;
  & svg { flex-shrink: 0; }
  ${({ $variant = 'default' }) => mediaVariantStyles[$variant] ?? mediaVariantStyles.default}
`

const StyledEmptyTitle = styled.div`
  font-size: 1.125rem;
  font-medium: 500;
  font-weight: 500;
  letter-spacing: -0.025em;
`

const StyledEmptyDescription = styled.div`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.625;
  font-weight: normal;

  & > a { text-decoration: underline; text-underline-offset: 4px; }
  & > a:hover { color: var(--primary); }
`

const StyledEmptyContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 24rem;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  text-wrap: balance;
`

function Empty({ ...props }: React.ComponentProps<'div'>) {
  return <StyledEmpty data-slot="empty" {...props} />
}

function EmptyHeader({ ...props }: React.ComponentProps<'div'>) {
  return <StyledEmptyHeader data-slot="empty-header" {...props} />
}

function EmptyMedia({
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & { variant?: 'default' | 'icon' }) {
  return (
    <StyledEmptyMedia
      data-slot="empty-icon"
      data-variant={variant}
      $variant={variant}
      {...props}
    />
  )
}

function EmptyTitle({ ...props }: React.ComponentProps<'div'>) {
  return <StyledEmptyTitle data-slot="empty-title" {...props} />
}

function EmptyDescription({ ...props }: React.ComponentProps<'p'>) {
  return <StyledEmptyDescription as="div" data-slot="empty-description" {...props} />
}

function EmptyContent({ ...props }: React.ComponentProps<'div'>) {
  return <StyledEmptyContent data-slot="empty-content" {...props} />
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}

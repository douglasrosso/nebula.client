import { Loader2Icon } from 'lucide-react'
import styled from 'styled-components'

const StyledSpinner = styled(Loader2Icon)`
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

function Spinner({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <StyledSpinner
      role="status"
      aria-label="Loading"
      {...props}
    />
  )
}

export { Spinner }

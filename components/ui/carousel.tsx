'use client'

import * as React from 'react'
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import styled from 'styled-components'

import { Button } from '@/components/ui/button'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

const StyledCarouselWrapper = styled.div`
  position: relative;
`

const CarouselInner = styled.div`
  overflow: hidden;
`

const CarouselTrack = styled.div<{ $isVertical?: boolean }>`
  display: flex;
  ${({ $isVertical }) =>
    $isVertical
      ? `flex-direction: column; margin-top: -1rem;`
      : `margin-left: -1rem;`}
`

const CarouselSlide = styled.div<{ $isVertical?: boolean }>`
  min-width: 0;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 100%;
  ${({ $isVertical }) =>
    $isVertical ? `padding-top: 1rem;` : `padding-left: 1rem;`}
`

const CarouselButtonBase = styled(Button)<{ $horizontal?: boolean; $isVertical?: boolean; $isPrev?: boolean }>`
  position: absolute;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;

  ${({ $isVertical, $isPrev }) =>
    $isVertical
      ? $isPrev
        ? `top: -3rem; left: 50%; transform: translateX(-50%) rotate(90deg);`
        : `bottom: -3rem; left: 50%; transform: translateX(-50%) rotate(90deg);`
      : $isPrev
        ? `top: 50%; left: -3rem; transform: translateY(-50%);`
        : `top: 50%; right: -3rem; transform: translateY(-50%);`}
`

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api?.off('select', onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <StyledCarouselWrapper
        onKeyDownCapture={handleKeyDown}
        className={className}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </StyledCarouselWrapper>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <CarouselInner ref={carouselRef} data-slot="carousel-content">
      <CarouselTrack
        $isVertical={orientation === 'vertical'}
        className={className}
        {...props}
      />
    </CarouselInner>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel()

  return (
    <CarouselSlide
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      $isVertical={orientation === 'vertical'}
      className={className}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <CarouselButtonBase
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      $isVertical={orientation === 'vertical'}
      $isPrev={true}
      className={className}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Previous slide</span>
    </CarouselButtonBase>
  )
}

function CarouselNext({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <CarouselButtonBase
      data-slot="carousel-next"
      variant={variant}
      size={size}
      $isVertical={orientation === 'vertical'}
      $isPrev={false}
      className={className}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Next slide</span>
    </CarouselButtonBase>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

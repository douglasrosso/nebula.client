'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import styled from 'styled-components'

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

const StyledChartContainer = styled.div`
  display: flex;
  aspect-ratio: 16 / 9;
  justify-content: center;
  font-size: 0.75rem;
  line-height: 1rem;

  & .recharts-cartesian-axis-tick text {
    fill: var(--muted-foreground);
  }

  & .recharts-cartesian-grid line[stroke='#ccc'] {
    stroke: color-mix(in oklch, var(--border) 50%, transparent);
  }

  & .recharts-curve.recharts-tooltip-cursor {
    stroke: var(--border);
  }

  & .recharts-polar-grid [stroke='#ccc'] {
    stroke: var(--border);
  }

  & .recharts-radial-bar-background-sector {
    fill: var(--muted);
  }

  & .recharts-rectangle.recharts-tooltip-cursor {
    fill: var(--muted);
  }

  & .recharts-reference-line [stroke='#ccc'] {
    stroke: var(--border);
  }

  & .recharts-dot[stroke='#fff'] {
    stroke: transparent;
  }

  & .recharts-layer {
    outline: none;
  }

  & .recharts-sector {
    outline: none;
  }

  & .recharts-sector[stroke='#fff'] {
    stroke: transparent;
  }

  & .recharts-surface {
    outline: none;
  }
`

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <StyledChartContainer
        data-slot="chart"
        data-chart={chartId}
        className={className}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </StyledChartContainer>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const StyledTooltipWrapper = styled.div`
  border: 1px solid color-mix(in oklch, var(--border) 50%, transparent);
  background-color: var(--background);
  display: grid;
  min-width: 8rem;
  align-items: start;
  gap: 0.375rem;
  border-radius: var(--radius-lg);
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  line-height: 1rem;
  box-shadow: 0 20px 25px -5px oklch(0 0 0 / 0.1);
`

const TooltipPayloadItem = styled.div<{ $isDot?: boolean }>`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.5rem;

  & > svg {
    color: var(--muted-foreground);
    height: 0.625rem;
    width: 0.625rem;
  }

  ${({ $isDot }) => $isDot && `align-items: center;`}
`

const TooltipValueWrapper = styled.div<{ $nestLabel?: boolean }>`
  display: flex;
  flex: 1;
  justify-content: space-between;
  line-height: 1;
  ${({ $nestLabel }) =>
    $nestLabel ? `align-items: flex-end;` : `align-items: center;`}
`

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: 'line' | 'dot' | 'dashed'
    nameKey?: string
    labelKey?: string
  }) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={labelClassName} style={{ fontWeight: 500 }}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={labelClassName} style={{ fontWeight: 500 }}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <StyledTooltipWrapper className={className}>
      {!nestLabel ? tooltipLabel : null}
      <div style={{ display: 'grid', gap: '0.375rem' }}>
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload.fill || item.color

          return (
            <TooltipPayloadItem
              key={item.dataKey}
              $isDot={indicator === 'dot'}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        style={{
                          flexShrink: 0,
                          borderRadius: '2px',
                          border: `1px solid ${indicatorColor}`,
                          backgroundColor: indicatorColor,
                          ...(indicator === 'dot' ? { width: '0.625rem', height: '0.625rem' } : {}),
                          ...(indicator === 'line' ? { width: '0.25rem' } : {}),
                          ...(indicator === 'dashed'
                            ? {
                                width: 0,
                                borderStyle: 'dashed',
                                backgroundColor: 'transparent',
                                ...(nestLabel ? { marginTop: '0.125rem', marginBottom: '0.125rem' } : {}),
                              }
                            : {}),
                        }}
                      />
                    )
                  )}
                  <TooltipValueWrapper $nestLabel={nestLabel}>
                    <div style={{ display: 'grid', gap: '0.375rem' }}>
                      {nestLabel ? tooltipLabel : null}
                      <span style={{ color: 'var(--muted-foreground)' }}>
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 500 }}>
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </TooltipValueWrapper>
                </>
              )}
            </TooltipPayloadItem>
          )
        })}
      </div>
    </StyledTooltipWrapper>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    hideIcon?: boolean
    nameKey?: string
  }) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        paddingBottom: verticalAlign === 'top' ? '0.75rem' : 0,
        paddingTop: verticalAlign !== 'top' ? '0.75rem' : 0,
      }}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                style={{
                  height: '0.5rem',
                  width: '0.5rem',
                  flexShrink: 0,
                  borderRadius: '2px',
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}

'use client'

import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import type { ButtonVariant } from '@/components/ui/button'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: ButtonVariant
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      style={{
        backgroundColor: 'var(--background)',
        padding: '0.75rem',
      } as React.CSSProperties}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: defaultClassNames.root,
        months: `flex gap-4 flex-col md:flex-row relative ${defaultClassNames.months}`,
        month: `flex flex-col w-full gap-4 ${defaultClassNames.month}`,
        nav: `flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between ${defaultClassNames.nav}`,
        button_previous: `size-8 aria-disabled:opacity-50 p-0 select-none inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground ${defaultClassNames.button_previous}`,
        button_next: `size-8 aria-disabled:opacity-50 p-0 select-none inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground ${defaultClassNames.button_next}`,
        month_caption: `flex items-center justify-center h-8 w-full px-8 ${defaultClassNames.month_caption}`,
        dropdowns: `w-full flex items-center text-sm font-medium justify-center h-8 gap-1.5 ${defaultClassNames.dropdowns}`,
        dropdown_root: `relative border border-input shadow-xs rounded-md ${defaultClassNames.dropdown_root}`,
        dropdown: `absolute bg-popover inset-0 opacity-0 ${defaultClassNames.dropdown}`,
        caption_label: `select-none font-medium ${captionLayout === 'label' ? 'text-sm' : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8'} ${defaultClassNames.caption_label}`,
        table: 'w-full border-collapse',
        weekdays: `flex ${defaultClassNames.weekdays}`,
        weekday: `text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none ${defaultClassNames.weekday}`,
        week: `flex w-full mt-2 ${defaultClassNames.week}`,
        week_number_header: `select-none w-8 ${defaultClassNames.week_number_header}`,
        week_number: `text-[0.8rem] select-none text-muted-foreground ${defaultClassNames.week_number}`,
        day: `relative w-full h-full p-0 text-center group/day aspect-square select-none ${defaultClassNames.day}`,
        range_start: `rounded-l-md bg-accent ${defaultClassNames.range_start}`,
        range_middle: `rounded-none ${defaultClassNames.range_middle}`,
        range_end: `rounded-r-md bg-accent ${defaultClassNames.range_end}`,
        today: `bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none ${defaultClassNames.today}`,
        outside: `text-muted-foreground aria-selected:text-muted-foreground ${defaultClassNames.outside}`,
        disabled: `text-muted-foreground opacity-50 ${defaultClassNames.disabled}`,
        hidden: `invisible ${defaultClassNames.hidden}`,
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={className}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={`size-4 ${className || ''}`} {...props} />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon className={`size-4 ${className || ''}`} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={`size-4 ${className || ''}`} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div style={{ display: 'flex', width: '2rem', height: '2rem', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={`flex aspect-square size-auto w-full min-w-8 flex-col gap-1 leading-none font-normal
        data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground
        data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground
        data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground
        data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground
        data-[range-end=true]:rounded-md data-[range-start=true]:rounded-md data-[range-middle=true]:rounded-none
        [&>span]:text-xs [&>span]:opacity-70 ${defaultClassNames.day} ${className || ''}`}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

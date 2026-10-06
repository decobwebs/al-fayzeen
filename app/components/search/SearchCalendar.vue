<script setup lang="ts">
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import {
  CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarNext, CalendarPrev, CalendarRoot,
  RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarNext, RangeCalendarPrev, RangeCalendarRoot,
} from 'reka-ui'
import type { DateRange } from 'reka-ui'

/** The shared calendar used by every date field. Range mode for depart/return, check-in/out; single otherwise. */
const props = defineProps<{ mode: 'range' | 'single', start: string | null, end?: string | null }>()
const emit = defineEmits<{ change: [{ start: string | null, end: string | null }] }>()

const { locale, t } = useI18n()
const dir = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
const min = today(getLocalTimeZone())
const isDesktop = useMediaQuery('(min-width: 768px)')
const months = computed(() => (isDesktop.value ? 2 : 1))

const toDate = (s: string | null | undefined) => (s ? parseDate(s) : undefined)

const range = shallowRef<DateRange>({ start: toDate(props.start), end: toDate(props.end) })
const single = shallowRef<DateValue | undefined>(toDate(props.start))

watch(range, (v) => {
  emit('change', { start: v.start?.toString() ?? null, end: v.end?.toString() ?? null })
})
watch(single, (v) => {
  emit('change', { start: v?.toString() ?? null, end: null })
})

const monthTitle = (d: DateValue) =>
  new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(d.year, d.month - 1, 15)))

const cell = 'relative grid size-10 place-items-center rounded-full text-[0.9375rem] tabular-nums outline-none transition-colors duration-150 hover:bg-marble focus-visible:ring-2 focus-visible:ring-kiswa data-[disabled]:pointer-events-none data-[disabled]:text-stone/40 data-[outside-view]:invisible data-[today]:font-bold data-[selected]:bg-kiswa data-[selected]:text-ihram'
const rangeCell = 'relative grid size-10 place-items-center text-[0.9375rem] tabular-nums outline-none transition-colors duration-150 rounded-full hover:bg-marble focus-visible:ring-2 focus-visible:ring-kiswa data-[disabled]:pointer-events-none data-[disabled]:text-stone/40 data-[outside-view]:invisible data-[today]:font-bold data-[highlighted]:rounded-none data-[highlighted]:bg-marble data-[selected]:rounded-none data-[selected]:bg-marble data-[selected]:text-kiswa data-[selection-start]:rounded-full! data-[selection-start]:bg-kiswa! data-[selection-start]:text-ihram! data-[selection-end]:rounded-full! data-[selection-end]:bg-kiswa! data-[selection-end]:text-ihram!'
</script>

<template>
  <RangeCalendarRoot
    v-if="mode === 'range'"
    v-slot="{ weekDays, grid }"
    v-model="range"
    :min-value="min"
    :number-of-months="months"
    :locale="locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB'"
    :week-starts-on="1"
    :dir="dir"
    fixed-weeks
    class="relative p-3"
  >
    <div class="absolute inset-x-3 top-3 flex justify-between">
      <RangeCalendarPrev class="grid size-10 place-items-center rounded-full hover:bg-marble disabled:opacity-30" :aria-label="t('search.prevMonth')">
        <Icon name="ph:caret-left-light" class="flip-rtl text-[1.125rem]" aria-hidden="true" />
      </RangeCalendarPrev>
      <RangeCalendarNext class="grid size-10 place-items-center rounded-full hover:bg-marble disabled:opacity-30" :aria-label="t('search.nextMonth')">
        <Icon name="ph:caret-right-light" class="flip-rtl text-[1.125rem]" aria-hidden="true" />
      </RangeCalendarNext>
    </div>
    <div class="flex flex-col gap-6 md:flex-row">
      <div v-for="month in grid" :key="month.value.toString()">
        <p class="grid h-10 place-items-center text-[0.9375rem] font-semibold">{{ monthTitle(month.value) }}</p>
        <RangeCalendarGrid class="mt-2 border-collapse">
          <RangeCalendarGridHead>
            <RangeCalendarGridRow class="flex">
              <RangeCalendarHeadCell v-for="d in weekDays" :key="d" class="w-10 pb-1 text-[0.75rem] font-medium text-stone">{{ d }}</RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>
          <RangeCalendarGridBody>
            <RangeCalendarGridRow v-for="(week, i) in month.rows" :key="i" class="flex">
              <RangeCalendarCell v-for="d in week" :key="d.toString()" :date="d" class="p-0">
                <RangeCalendarCellTrigger :day="d" :month="month.value" :class="rangeCell" />
              </RangeCalendarCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridBody>
        </RangeCalendarGrid>
      </div>
    </div>
  </RangeCalendarRoot>

  <CalendarRoot
    v-else
    v-slot="{ weekDays, grid }"
    v-model="single"
    :min-value="min"
    :number-of-months="1"
    :locale="locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB'"
    :week-starts-on="1"
    :dir="dir"
    fixed-weeks
    class="relative p-3"
  >
    <div class="absolute inset-x-3 top-3 flex justify-between">
      <CalendarPrev class="grid size-10 place-items-center rounded-full hover:bg-marble disabled:opacity-30" :aria-label="t('search.prevMonth')">
        <Icon name="ph:caret-left-light" class="flip-rtl text-[1.125rem]" aria-hidden="true" />
      </CalendarPrev>
      <CalendarNext class="grid size-10 place-items-center rounded-full hover:bg-marble disabled:opacity-30" :aria-label="t('search.nextMonth')">
        <Icon name="ph:caret-right-light" class="flip-rtl text-[1.125rem]" aria-hidden="true" />
      </CalendarNext>
    </div>
    <div v-for="month in grid" :key="month.value.toString()">
      <p class="grid h-10 place-items-center text-[0.9375rem] font-semibold">{{ monthTitle(month.value) }}</p>
      <CalendarGrid class="mt-2 border-collapse">
        <CalendarGridHead>
          <CalendarGridRow class="flex">
            <CalendarHeadCell v-for="d in weekDays" :key="d" class="w-10 pb-1 text-[0.75rem] font-medium text-stone">{{ d }}</CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(week, i) in month.rows" :key="i" class="flex">
            <CalendarCell v-for="d in week" :key="d.toString()" :date="d" class="p-0">
              <CalendarCellTrigger :day="d" :month="month.value" :class="cell" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>

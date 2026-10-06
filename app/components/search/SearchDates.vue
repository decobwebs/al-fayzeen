<script setup lang="ts">
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'

/**
 * Date cell(s) that open the shared calendar popover.
 * Range mode renders two adjoining cells (e.g. Depart | Return) that open the same calendar.
 */
const props = withDefaults(defineProps<{
  id: string
  mode?: 'range' | 'single'
  startLabel: string
  endLabel?: string
}>(), { mode: 'single' })

const start = defineModel<string | null>('start', { default: null })
const end = defineModel<string | null>('end', { default: null })

const { t } = useI18n()
const open = ref(false)

const fmt = (iso: string | null) => (iso ? formatDate(iso, { weekday: 'short', day: 'numeric', month: 'short' }) : t('search.selectDate'))

function onChange(v: { start: string | null, end: string | null }) {
  start.value = v.start
  if (props.mode === 'range') {
    end.value = v.end
    if (v.start && v.end) setTimeout(() => { open.value = false }, 250)
  }
  else if (v.start) {
    setTimeout(() => { open.value = false }, 200)
  }
}

const SearchCalendar = defineAsyncComponent(() => import('./SearchCalendar.vue'))
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverAnchor as-child>
        <SearchField :label="startLabel" :half="mode === 'range'">
          <button :id="id" type="button" class="peer absolute inset-0 h-full w-full cursor-pointer rounded-sm outline-none lg:rounded-none" :aria-label="`${startLabel}: ${fmt(start)}`" aria-haspopup="dialog" :aria-expanded="open" @click="open = true" />
          <span class="pointer-events-none flex items-center gap-2 truncate text-[1rem] font-medium text-white">
            <Icon name="ph:calendar-blank-light" class="shrink-0 text-[1.125rem] text-white/75" aria-hidden="true" />
            <span class="ltr-iso truncate">{{ fmt(start) }}</span>
          </span>
          <span class="pointer-events-none absolute inset-0 rounded-sm ring-white/80 peer-focus-visible:ring-2 lg:rounded-none" aria-hidden="true" />
        </SearchField>
    </PopoverAnchor>
        <SearchField v-if="mode === 'range' && endLabel" :label="endLabel" half>
          <button :id="`${id}-end`" type="button" class="peer absolute inset-0 h-full w-full cursor-pointer rounded-sm outline-none lg:rounded-none" :aria-label="`${endLabel}: ${fmt(end)}`" aria-haspopup="dialog" :aria-expanded="open" @click="open = true" />
          <span class="pointer-events-none flex items-center gap-2 truncate text-[1rem] font-medium text-white">
            <Icon name="ph:calendar-blank-light" class="shrink-0 text-[1.125rem] text-white/75" aria-hidden="true" />
            <span class="ltr-iso truncate">{{ fmt(end) }}</span>
          </span>
          <span class="pointer-events-none absolute inset-0 rounded-sm ring-white/80 peer-focus-visible:ring-2 lg:rounded-none" aria-hidden="true" />
        </SearchField>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        align="start"
        :side-offset="8"
        :collision-padding="12"
        class="popover-pane z-[60] rounded-md border border-line bg-ihram text-kiswa shadow-[0_24px_60px_-20px_rgba(11,11,12,.45)]"
        :aria-label="mode === 'range' ? t('search.selectDates') : t('search.selectDate')"
      >
        <SearchCalendar :mode="mode" :start="start" :end="end" @change="onChange" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

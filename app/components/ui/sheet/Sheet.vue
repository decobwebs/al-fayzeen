<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

/**
 * Sheet (shadcn-vue pattern on reka-ui Dialog), restyled to the house tokens.
 * side "auto": bottom sheet under 768px, end-side sheet above. "start"/"end" are logical (flip in RTL).
 */
const props = withDefaults(defineProps<{
  title: string
  description?: string
  side?: 'auto' | 'start' | 'end' | 'bottom'
  width?: string
  hideHeader?: boolean
}>(), { side: 'auto', width: '520px' })

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="sheet-overlay fixed inset-0 z-[80] bg-kiswa/45" />
      <DialogContent
        class="sheet-content fixed z-[90] flex flex-col bg-ihram text-kiswa shadow-[0_-20px_60px_-20px_rgba(11,11,12,.35)] outline-none"
        :class="`sheet--${side}`"
        :style="{ '--sheet-w': width }"
      >
        <div v-if="side === 'auto' || side === 'bottom'" class="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-pill bg-line md:hidden" aria-hidden="true" :class="side === 'bottom' && 'md:block'" />
        <header class="flex shrink-0 items-start justify-between gap-4 px-5 pb-2 pt-4 md:px-8 md:pt-7" :class="hideHeader && 'sr-only'">
          <div class="min-w-0">
            <DialogTitle class="t-h3 text-[1.625rem] leading-tight md:text-[1.875rem]">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="mt-1.5 text-[0.9375rem] text-stone">{{ description }}</DialogDescription>
            <DialogDescription v-else class="sr-only">{{ title }}</DialogDescription>
          </div>
          <DialogClose
            class="-me-2 grid size-11 shrink-0 place-items-center rounded-pill text-kiswa transition-colors duration-200 hover:bg-marble"
            :aria-label="t('common.close')"
          >
            <Icon name="ph:x-light" class="text-[1.375rem]" aria-hidden="true" />
          </DialogClose>
        </header>
        <div class="sheet-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8">
          <slot />
        </div>
        <slot name="footer" />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
.sheet-overlay[data-state="open"] { animation: sheet-fade-in 300ms var(--ease); }
.sheet-overlay[data-state="closed"] { animation: sheet-fade-out 200ms var(--ease); }

/* bottom sheet */
.sheet--bottom,
.sheet--auto {
  inset-inline: 0;
  bottom: 0;
  max-height: 92svh;
  border-radius: 22px 22px 0 0;
}
.sheet--bottom[data-state="open"], .sheet--auto[data-state="open"] { animation: sheet-up 450ms var(--ease); }
.sheet--bottom[data-state="closed"], .sheet--auto[data-state="closed"] { animation: sheet-down 250ms var(--ease); }

/* side sheets */
.sheet--end, .sheet--start { top: 0; bottom: 0; width: min(var(--sheet-w), 100vw); }
.sheet--end { inset-inline-end: 0; border-start-start-radius: 22px; border-end-start-radius: 22px; }
.sheet--start { inset-inline-start: 0; border-start-end-radius: 22px; border-end-end-radius: 22px; }
.sheet--end[data-state="open"] { animation: sheet-in-end 450ms var(--ease); }
.sheet--end[data-state="closed"] { animation: sheet-out-end 250ms var(--ease); }
.sheet--start[data-state="open"] { animation: sheet-in-start 450ms var(--ease); }
.sheet--start[data-state="closed"] { animation: sheet-out-start 250ms var(--ease); }

@media (min-width: 768px) {
  .sheet--auto {
    inset-inline: auto 0;
    top: 0;
    bottom: 0;
    max-height: none;
    width: min(var(--sheet-w), 100vw);
    border-radius: 0;
    border-start-start-radius: 22px;
    border-end-start-radius: 22px;
  }
  .sheet--auto[data-state="open"] { animation: sheet-in-end 450ms var(--ease); }
  .sheet--auto[data-state="closed"] { animation: sheet-out-end 250ms var(--ease); }
}

@keyframes sheet-fade-in { from { opacity: 0; } }
@keyframes sheet-fade-out { to { opacity: 0; } }
@keyframes sheet-up { from { transform: translateY(100%); } }
@keyframes sheet-down { to { transform: translateY(100%); } }
@keyframes sheet-in-end { from { transform: translateX(100%); } }
@keyframes sheet-out-end { to { transform: translateX(100%); } }
@keyframes sheet-in-start { from { transform: translateX(-100%); } }
@keyframes sheet-out-start { to { transform: translateX(-100%); } }
[dir="rtl"] .sheet--end[data-state="open"], [dir="rtl"] .sheet--auto[data-state="open"] { animation-name: sheet-in-start; }
[dir="rtl"] .sheet--end[data-state="closed"], [dir="rtl"] .sheet--auto[data-state="closed"] { animation-name: sheet-out-start; }
[dir="rtl"] .sheet--start[data-state="open"] { animation-name: sheet-in-end; }
[dir="rtl"] .sheet--start[data-state="closed"] { animation-name: sheet-out-end; }
@media (max-width: 767.98px) {
  [dir="rtl"] .sheet--auto[data-state="open"] { animation-name: sheet-up; }
  [dir="rtl"] .sheet--auto[data-state="closed"] { animation-name: sheet-down; }
}
</style>

<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'on-dark' | 'on-dark-outline' | 'link' | 'link-dark'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: 'md' | 'lg'
  /** locale-less path, e.g. '/packages' or '/#questions' */
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
  iconStart?: string
  iconEnd?: string
  /** flips iconEnd/iconStart in RTL (arrows) */
  directional?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  directional: true,
})

const isLink = computed(() => props.variant === 'link' || props.variant === 'link-dark')

const classes = computed(() => [
  'app-btn group/btn relative inline-flex items-center justify-center gap-2 font-semibold select-none whitespace-nowrap',
  'transition-[background-color,color,border-color,transform] duration-200 ease-house',
  isLink.value
    ? 'app-btn--link min-h-11 px-0.5 underline-offset-[6px] decoration-1 hover:underline'
    : [
        'rounded-pill border overflow-hidden active:scale-[0.98]',
        props.size === 'lg' ? 'min-h-14 px-8 text-[1.0625rem]' : 'min-h-11 px-6 text-[0.9375rem]',
      ],
  {
    'app-btn--primary bg-kiswa text-ihram border-kiswa hover:bg-[#232326]': props.variant === 'primary',
    'bg-transparent text-kiswa border-kiswa hover:bg-kiswa hover:text-ihram': props.variant === 'secondary',
    'app-btn--primary app-btn--glint-dark bg-ihram text-kiswa border-ihram hover:bg-white': props.variant === 'on-dark',
    'bg-transparent text-on-dark border-on-dark/70 hover:border-on-dark hover:bg-on-dark hover:text-kiswa': props.variant === 'on-dark-outline',
    'text-kiswa': props.variant === 'link',
    'text-on-dark': props.variant === 'link-dark',
    'w-full': props.block,
    'pointer-events-none opacity-45': props.disabled,
  },
])
</script>

<template>
  <NuxtLinkLocale v-if="to && !disabled" :to="to" :class="classes">
    <Icon v-if="iconStart" :name="iconStart" class="size-[1.15em] shrink-0" :class="{ 'flip-rtl': directional }" aria-hidden="true" />
    <slot name="start" />
    <span class="relative z-[1]"><slot /></span>
    <slot name="end" />
    <Icon v-if="iconEnd" :name="iconEnd" class="size-[1.15em] shrink-0 transition-transform duration-200 ease-house group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" :class="{ 'flip-rtl': directional }" aria-hidden="true" />
  </NuxtLinkLocale>
  <a v-else-if="href && !disabled" :href="href" target="_blank" rel="noopener" :class="classes">
    <Icon v-if="iconStart" :name="iconStart" class="size-[1.15em] shrink-0" aria-hidden="true" />
    <slot name="start" />
    <span class="relative z-[1]"><slot /></span>
    <slot name="end" />
    <Icon v-if="iconEnd" :name="iconEnd" class="size-[1.15em] shrink-0" :class="{ 'flip-rtl': directional }" aria-hidden="true" />
  </a>
  <button v-else :type="type" :disabled="disabled" :aria-disabled="disabled || undefined" :class="classes">
    <Icon v-if="iconStart" :name="iconStart" class="size-[1.15em] shrink-0" :class="{ 'flip-rtl': directional }" aria-hidden="true" />
    <slot name="start" />
    <span class="relative z-[1]"><slot /></span>
    <slot name="end" />
    <Icon v-if="iconEnd" :name="iconEnd" class="size-[1.15em] shrink-0 transition-transform duration-200 ease-house group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" :class="{ 'flip-rtl': directional }" aria-hidden="true" />
  </button>
</template>

<style scoped>
/* White glint sweeps across primary buttons on hover (600 ms) */
.app-btn--primary::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, .28) 48%, rgba(255, 255, 255, .05) 56%, transparent 70%);
  transform: translateX(-120%);
  pointer-events: none;
}
.app-btn--glint-dark::after {
  background: linear-gradient(105deg, transparent 30%, rgba(11, 11, 12, .12) 48%, rgba(11, 11, 12, .02) 56%, transparent 70%);
}
.app-btn--primary:hover::after {
  transform: translateX(120%);
  transition: transform 600ms var(--ease);
}
[dir="rtl"] .app-btn--primary::after { transform: translateX(120%); }
[dir="rtl"] .app-btn--primary:hover::after { transform: translateX(-120%); }
</style>

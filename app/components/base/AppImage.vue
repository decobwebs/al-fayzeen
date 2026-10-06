<script setup lang="ts">
import { getAsset } from '~/data/assets'
import type { Ratio } from '~/data/assets'

/**
 * The only way to render an image: <AppImage slot="pkg-rahmah" />.
 * Ready slots render NuxtImg with the house grade; pending slots render the designed skeleton.
 */
const props = withDefaults(defineProps<{
  slot: string
  arch?: boolean
  sizes?: string
  priority?: boolean
  /** fill the positioned parent instead of using the slot ratio */
  fill?: boolean
  ratio?: Ratio
  rounded?: 'none' | 'sm' | 'md'
  /** decorative usage → empty alt */
  decorative?: boolean
  /** enables the card-hover image zoom (parent needs the `group` class) */
  zoom?: boolean
  imgClass?: string
}>(), { sizes: '100vw', rounded: 'md' })

const asset = computed(() => getAsset(props.slot))
const config = useRuntimeConfig()
const showLabels = computed(() => `${config.public.showAssetLabels}` === 'true')

// @nuxt/image treats an unprefixed size as "below 1px". Expand "100vw md:50vw lg:420px" so every
// configured screen gets the value in force at that breakpoint (mobile-first, like Tailwind).
const SCREENS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', '2xl'] as const
const expandedSizes = computed(() => {
  const given: Record<string, string> = {}
  for (const entry of props.sizes.split(/\s+/).filter(Boolean)) {
    const [k, v] = entry.includes(':') ? entry.split(':') as [string, string] : ['xs', entry]
    given[k] = v
  }
  let current = given.xs ?? '100vw'
  return SCREENS.map((s) => {
    current = given[s] ?? current
    return `${s}:${current}`
  }).join(' ')
})

const ratio = computed(() => props.ratio ?? asset.value.ratio)
const [rw, rh] = ratio.value.split(':').map(Number) as [number, number]
const aspect = computed(() => {
  const [w, h] = ratio.value.split(':').map(Number) as [number, number]
  return `${w} / ${h}`
})
const ready = computed(() => asset.value.status === 'ready' && asset.value.kind === 'image')
const dark = computed(() => asset.value.tone === 'dark')

const shape = computed(() => props.arch
  ? 'rounded-arch'
  : ({ none: '', sm: 'rounded-sm', md: 'rounded-md' })[props.rounded])
</script>

<template>
  <div
    class="app-image overflow-hidden"
    :class="[shape, fill ? 'absolute inset-0 h-full w-full' : 'relative w-full', !ready && (dark ? 'bg-kiswa-soft text-on-dark-muted' : 'bg-marble text-stone')]"
    :style="fill ? undefined : { aspectRatio: aspect }"
  >
    <NuxtImg
      v-if="ready"
      :src="`/images/${asset.file}`"
      :alt="decorative ? '' : asset.alt"
      :sizes="expandedSizes"
      :width="rw * 400"
      :height="rh * 400"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      :preload="priority ? { fetchPriority: 'high' } : undefined"
      class="house-grade absolute inset-0 h-full w-full object-cover"
      :class="[zoom && 'transition-transform duration-700 ease-house group-hover:scale-[1.04]', imgClass]"
    />
    <div
      v-else
      class="absolute inset-0 grid place-items-center"
      role="img"
      :aria-label="decorative ? undefined : asset.alt"
      :aria-hidden="decorative || undefined"
    >
      <MashrabiyaPattern :opacity="0.06" :size="44" />
      <Icon :name="asset.icon" class="relative text-[2.25rem] opacity-70" aria-hidden="true" />
      <span
        v-if="showLabels"
        class="absolute inset-x-3 bottom-3 rounded-sm bg-ihram/90 px-2 py-1 font-mono text-[11px] leading-snug text-kiswa"
      >
        {{ asset.id }} · {{ asset.keyword }}
      </span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { site } from '~/data/site'

const { t } = useI18n()
const reduced = useReducedMotion()
const paused = ref(false)

const items = computed(() => [
  { icon: 'ph:seal-check-light', text: t('trust.licensed'), licence: true },
  { icon: 'ph:buildings-light', text: t('trust.office') },
  { icon: 'ph:stamp-light', text: t('trust.visa') },
  { icon: 'ph:chats-circle-light', text: t('trust.support') },
])
</script>

<template>
  <section class="bg-ihram pb-4 pt-6 md:pt-8" :aria-label="t('trust.label')">
    <!-- desktop: one line -->
    <ul class="wrap hidden items-center justify-between gap-8 lg:flex">
      <li v-for="it in items" :key="it.icon" class="flex items-center gap-3 text-[0.9375rem] text-kiswa">
        <Icon :name="it.icon" class="shrink-0 text-[1.5rem]" aria-hidden="true" />
        <span>
          {{ it.text }}<template v-if="it.licence"> · <span v-if="site.licence.number" class="ltr-iso">{{ site.licence.number }}</span><GapText v-else :text="t('trust.licenceGap')" /></template>
        </span>
      </li>
    </ul>
    <!-- mobile / tablet: slow marquee that pauses on touch -->
    <div
      class="trust-marquee relative overflow-hidden lg:hidden"
      :class="{ 'is-paused': paused, 'is-static': reduced }"
      @touchstart.passive="paused = true"
      @touchend="paused = false"
      @touchcancel="paused = false"
    >
      <div class="trust-track flex w-max">
        <ul v-for="copy in (reduced ? 1 : 2)" :key="copy" class="flex shrink-0 items-center gap-10 pe-10" :aria-hidden="copy === 2 || undefined">
          <li v-for="it in items" :key="it.icon" class="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[0.9375rem] text-kiswa">
            <Icon :name="it.icon" class="shrink-0 text-[1.375rem]" aria-hidden="true" />
            <span>
              {{ it.text }}<template v-if="it.licence"> · <GapText v-if="!site.licence.number" :text="t('trust.licenceGap')" /><span v-else class="ltr-iso">{{ site.licence.number }}</span></template>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust-marquee { mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
.trust-track { animation: marquee 38s linear infinite; }
.is-paused .trust-track { animation-play-state: paused; }
.is-static { overflow-x: auto; mask-image: none; }
.is-static .trust-track { animation: none; }
@keyframes marquee { to { transform: translateX(-50%); } }
[dir="rtl"] .trust-track { animation-name: marquee-rtl; }
@keyframes marquee-rtl { to { transform: translateX(50%); } }
</style>

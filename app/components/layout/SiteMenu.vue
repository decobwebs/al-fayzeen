<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

/** Full-screen mobile menu on Ihram White. Loaded on first open. */
defineProps<{ links: { to: string, label: string }[] }>()
const emit = defineEmits<{ plan: [], contact: ['whatsapp' | 'email'] }>()
const { t } = useI18n()
const { menuOpen } = useSiteChrome()
const reduced = useReducedMotion()
const plan = () => emit('plan')
const contactVia = (c: 'whatsapp' | 'email') => emit('contact', c)
</script>

<template>
  <DialogRoot v-model:open="menuOpen">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[70] bg-ihram" />
      <DialogContent :aria-describedby="undefined" class="menu-panel fixed inset-0 z-[75] flex flex-col overflow-y-auto bg-ihram text-kiswa outline-none">
        <DialogTitle class="sr-only">{{ t('common.menu') }}</DialogTitle>
        <div class="wrap flex h-[72px] shrink-0 items-center justify-between border-b border-line">
          <NuxtLinkLocale to="/" :aria-label="t('nav.home')" @click="menuOpen = false"><Wordmark /></NuxtLinkLocale>
          <DialogClose class="-me-2 grid size-11 place-items-center rounded-pill" :aria-label="t('common.closeMenu')">
            <Icon name="ph:x-light" class="text-[1.625rem]" aria-hidden="true" />
          </DialogClose>
        </div>
        <nav :aria-label="t('nav.primary')" class="wrap flex-1 py-6">
          <ul>
            <li
              v-for="(l, i) in [...links, { to: '/contact', label: t('nav.contact') }]"
              :key="l.to"
              class="menu-item border-b border-line"
              :style="reduced ? undefined : { animationDelay: `${60 + i * 40}ms` }"
            >
              <NuxtLinkLocale :to="l.to" class="flex min-h-16 items-center justify-between font-display text-[2.125rem] leading-none rtl:font-ar-display rtl:text-[1.75rem]" @click="menuOpen = false">
                {{ l.label }}
                <Icon name="ph:arrow-right-light" class="flip-rtl text-[1.375rem] text-stone" aria-hidden="true" />
              </NuxtLinkLocale>
            </li>
          </ul>
        </nav>
        <div class="wrap grid shrink-0 gap-3 border-t border-line pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <div class="flex items-center justify-between">
            <LanguageSwitch />
            <AppButton variant="link" @click="plan">{{ t('nav.plan') }}</AppButton>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <AppButton icon-start="ph:whatsapp-logo-light" :directional="false" @click="contactVia('whatsapp')">{{ t('common.whatsapp') }}</AppButton>
            <AppButton variant="secondary" icon-start="ph:envelope-simple-light" :directional="false" @click="contactVia('email')">{{ t('common.email') }}</AppButton>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.menu-item { animation: menu-in 450ms var(--ease) both; }
@keyframes menu-in { from { opacity: 0; transform: translateY(10px); } }
@media (prefers-reduced-motion: reduce) { .menu-item { animation: none; } }
</style>

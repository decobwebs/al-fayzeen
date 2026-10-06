<script setup lang="ts">
const { t } = useI18n()
const { y, hidden, menuOpen, navOverHero } = useSiteChrome()
const { open: openEnquiry } = useEnquiry()
const route = useRoute()

const links = computed(() => [
  { to: '/packages', label: t('nav.packages') },
  { to: '/flights', label: t('nav.flights') },
  { to: '/hotels', label: t('nav.hotels') },
  { to: '/transport', label: t('nav.transport') },
  { to: '/visa', label: t('nav.visa') },
  { to: '/guide', label: t('nav.guide') },
])

// hide on scroll down, show on scroll up (only after 400px)
let last = 0
watch(y, (now) => {
  if (menuOpen.value) return
  if (now < 400) hidden.value = false
  else if (now > last + 6) hidden.value = true
  else if (now < last - 6) hidden.value = false
  last = now
})

const menuMounted = ref(false)
watch(menuOpen, (o) => { if (o) menuMounted.value = true })

watch(() => route.fullPath, () => { menuOpen.value = false; hidden.value = false })

function plan() {
  menuOpen.value = false
  openEnquiry({ type: 'general', title: '', details: {} })
}
function contactVia(channel: 'whatsapp' | 'email') {
  menuOpen.value = false
  openEnquiry({ type: 'general', title: '', details: {} }, { channel })
}
</script>

<template>
  <header
    class="site-nav fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-200 ease-house"
    :class="[
      navOverHero ? 'site-nav--glass on-dark text-on-dark' : 'border-b border-line bg-ihram/95 text-kiswa backdrop-blur-[2px]',
      hidden ? '-translate-y-full' : 'translate-y-0',
    ]"
  >
    <a href="#main" class="sr-only z-[60] rounded-pill bg-kiswa px-4 py-2 text-ihram focus:not-sr-only focus:absolute focus:start-4 focus:top-3">{{ t('common.skip') }}</a>
    <div class="wrap flex h-[72px] items-center gap-6">
      <NuxtLinkLocale to="/" class="-my-1 shrink-0 py-1" :aria-label="t('nav.home')">
        <Wordmark />
      </NuxtLinkLocale>

      <nav :aria-label="t('nav.primary')" class="mx-auto hidden xl:block">
        <ul class="flex items-center gap-1">
          <li v-for="l in links" :key="l.to">
            <NuxtLinkLocale
              :to="l.to"
              class="nav-link relative grid min-h-11 place-items-center px-3 text-[0.9375rem] font-medium"
              active-class="nav-link--active"
            >
              {{ l.label }}
            </NuxtLinkLocale>
          </li>
        </ul>
      </nav>

      <div class="ms-auto flex items-center gap-2 xl:ms-0">
        <LanguageSwitch class="hidden md:flex" :tone="navOverHero ? 'dark' : 'light'" />
        <NuxtLinkLocale to="/contact" class="nav-link relative hidden min-h-11 place-items-center px-3 text-[0.9375rem] font-medium lg:grid" active-class="nav-link--active">
          {{ t('nav.contact') }}
        </NuxtLinkLocale>
        <AppButton class="hidden sm:inline-flex" :variant="navOverHero ? 'on-dark' : 'primary'" @click="plan">
          {{ t('nav.plan') }}
        </AppButton>
        <button
          type="button"
          class="-me-2 grid size-11 place-items-center rounded-pill xl:hidden"
          :aria-label="t('common.menu')"
          aria-haspopup="dialog"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <Icon name="ph:list-light" class="text-[1.625rem]" aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>

  <LazySiteMenu v-if="menuMounted" :links="links" @plan="plan" @contact="contactVia" />
</template>

<style scoped>
.site-nav--glass {
  background: linear-gradient(to bottom, rgba(11, 11, 12, .28), rgba(11, 11, 12, .08));
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  backdrop-filter: blur(14px) saturate(1.4);
  border-bottom: 1px solid rgba(255, 255, 255, .16);
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, .06);
}
.nav-link::after {
  content: "";
  position: absolute;
  inset-inline: .75rem;
  bottom: .55rem;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: var(--origin, left);
  transition: transform 200ms var(--ease);
}
[dir="rtl"] .nav-link::after { --origin: right; }
.nav-link:hover::after, .nav-link--active::after { transform: scaleX(1); }

</style>

<script setup lang="ts">
import { packages } from '~/data/packages'
import { hotels } from '~/data/hotels'
import { faqs } from '~/data/faqs'
import { visa } from '~/data/visa'
import { site } from '~/data/site'

definePageMeta({ bottomBar: true })
const route = useRoute()
const { t } = useI18n()
const dt = useDataText()
const pkg = computed(() => packages.find(p => p.slug === route.params.slug))
if (!pkg.value) throw createError({ statusCode: 404, statusMessage: 'Package not found', fatal: true })
const p = computed(() => pkg.value!)

useHead({ title: () => `${dt(p.value.name)} · ${t('list.h1')}` })

const nights = computed(() => p.value.nights.makkah + p.value.nights.madinah)
const cityName = (code: string) => dt(site.departureCities.find(c => c.code === code)?.city ?? code)

/* gallery: the package image + four supporting slots (pending skeletons until photos arrive) */
const gallery = computed(() => [p.value.image, 'hotel-makkah', 'hotel-room', 'journey-train', 'hotel-madinah'])
const active = ref(0)

const stayHotels = computed(() => hotels.filter(h => h.inPackages.includes(p.value.slug)))
const similar = computed(() => packages.filter(x => x.slug !== p.value.slug).slice(0, 3))
const pkgFaqs = computed(() => faqs.filter(f => f.topic !== 'travel').concat(faqs.filter(f => f.topic === 'travel').slice(0, 2)))

const routePoints = computed(() => {
  const madinahFirst = p.value.itinerary.find(d => d.city !== 'travel')?.city === 'madinah'
  const first = cityName(p.value.departureCities[0] ?? 'LOS')
  const mk = { code: 'MAK', label: t('journey.route.MAK'), tone: 'makkah' as const }
  const md = { code: 'MED', label: t('journey.route.MED'), tone: 'madinah' as const }
  return [
    { code: p.value.departureCities[0] ?? 'LOS', label: first },
    madinahFirst ? { code: 'MED', label: t('journey.route.MED'), tone: 'madinah' as const } : { code: 'JED', label: t('journey.route.JED') },
    ...(madinahFirst ? [mk] : [mk, md]),
  ].filter((x, i, a) => a.findIndex(y => y.code === x.code) === i)
})

/* in-page section nav */
const sections = ['overview', 'itinerary', 'hotels', 'included', 'visa', 'payment', 'cancellation', 'questions'] as const
const current = ref<string>('overview')
const { hidden } = useSiteChrome()
let io: IntersectionObserver | null = null
onMounted(() => {
  io = new IntersectionObserver((entries) => {
    const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (vis[0]) current.value = vis[0].target.id
  }, { rootMargin: '-140px 0px -55% 0px' })
  sections.forEach(s => document.getElementById(s) && io!.observe(document.getElementById(s)!))
})
onBeforeUnmount(() => io?.disconnect())
const chipRow = ref<HTMLElement | null>(null)
watch(current, (id) => {
  chipRow.value?.querySelector<HTMLElement>(`[data-id="${id}"]`)?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
})

const bookOpen = ref(false)
const booking = useState(`booking-${p.value.slug}`, () => ({ departure: p.value.departures[0] ?? '', room: 'quad' as const, travellers: Math.max(1, Number(route.query.pax) || 2) }))
const total = computed(() => p.value.priceFrom[booking.value.room] * booking.value.travellers)
</script>

<template>
  <div class="pb-28 lg:pb-0">
    <div class="wrap pt-6 md:pt-8">
      <AppButton variant="link" to="/packages" icon-start="ph:arrow-left-light">{{ t('detail.back') }}</AppButton>
    </div>

    <!-- gallery + title -->
    <div class="wrap mt-4 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <section :aria-label="t('detail.galleryLabel')" class="grid gap-3 sm:grid-cols-[1fr_96px] lg:grid-cols-[1fr_112px]">
        <div class="relative">
          <AppImage :slot="gallery[active]!" arch ratio="3:4" priority sizes="100vw lg:560px" />
          <div class="absolute start-4 top-[38%]"><SampleBadge variant="glass" /></div>
        </div>
        <ul class="grid grid-cols-5 gap-2 sm:grid-cols-1 sm:content-start">
          <li v-for="(g, i) in gallery" :key="g + i">
            <button
              type="button"
              class="block w-full overflow-hidden rounded-sm ring-offset-2 transition-[box-shadow,opacity] duration-200"
              :class="active === i ? 'ring-2 ring-kiswa' : 'opacity-75 hover:opacity-100'"
              :aria-label="t('detail.gallery', { n: i + 1, total: gallery.length })"
              :aria-pressed="active === i"
              @click="active = i"
            >
              <AppImage :slot="g" ratio="1:1" rounded="none" decorative sizes="112px" />
            </button>
          </li>
        </ul>
      </section>

      <div class="lg:pt-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="t-label inline-flex items-center gap-1.5 text-stone"><Icon v-if="p.tier === 'ramadan'" name="ph:moon-stars-fill" class="text-[0.875rem] text-gold" aria-hidden="true" />{{ dt(p.tierLabel) }}</span>
          <SampleBadge />
          <span v-if="p.featured" class="t-label text-stone">· {{ t('card.mostChosen') }}</span>
        </div>
        <h1 class="t-hero mt-3 text-[3.25rem]! md:text-[4.5rem]!">{{ dt(p.name) }}</h1>
        <p class="mt-1 font-display text-[1.5rem] italic text-stone">{{ dt(p.meaning) }}</p>
        <NightsSplit class="mt-6 max-w-md" :makkah="p.nights.makkah" :madinah="p.nights.madinah" />
        <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-[0.9375rem]">
          <div><dt class="t-label text-stone">{{ t('list.rows.nights') }}</dt><dd class="mt-1 font-semibold tabular-nums">{{ nights }}</dd></div>
          <div><dt class="t-label text-stone">{{ t('detail.overview.from') }}</dt><dd class="mt-1 font-semibold">{{ p.departureCities.map(cityName).join(', ') }}</dd></div>
          <div><dt class="t-label text-stone">{{ t('detail.overview.hotelMakkah') }}</dt><dd class="mt-1 font-semibold">{{ t('detail.overview.walkShort', { min: p.hotel.makkahWalkMin }) }}</dd></div>
          <div><dt class="t-label text-stone">{{ t('detail.overview.flights') }}</dt><dd class="mt-1 font-semibold">{{ p.flightsIncluded ? t('detail.overview.flightsYes') : t('detail.overview.flightsNo') }}</dd></div>
        </dl>
        <PriceTag class="mt-8" :amount="p.priceFrom.quad" :prefix="t('common.from')" :suffix="t('common.perPerson')" size="lg" />
        <p v-if="p.note" class="mt-4 flex gap-2 rounded-sm bg-marble p-3 text-[0.875rem] text-stone">
          <Icon name="ph:info-light" class="mt-0.5 shrink-0 text-[1.125rem]" aria-hidden="true" />{{ dt(p.note) }}
        </p>
      </div>
    </div>

    <!-- sticky in-page nav -->
    <nav
      :aria-label="t('detail.sectionNav')"
      class="sticky z-30 mt-12 border-y border-line bg-ihram/95 backdrop-blur-[2px] transition-[top] duration-200 ease-house md:mt-16"
      :class="hidden ? 'top-0' : 'top-[72px]'"
    >
      <ul ref="chipRow" class="wrap no-scrollbar flex gap-1 overflow-x-auto py-2">
        <li v-for="s in sections" :key="s" :data-id="s" class="shrink-0">
          <a
            :href="`#${s}`"
            class="grid min-h-10 place-items-center whitespace-nowrap rounded-pill px-4 text-[0.875rem] font-semibold transition-colors duration-200"
            :class="current === s ? 'bg-kiswa text-ihram' : 'text-stone hover:text-kiswa'"
            :aria-current="current === s ? 'location' : undefined"
          >{{ t(`detail.nav.${s}`) }}</a>
        </li>
      </ul>
    </nav>

    <div class="wrap grid gap-12 pt-12 lg:grid-cols-[1fr_380px] lg:gap-16">
      <div class="grid min-w-0 gap-16 md:gap-20">
        <section id="overview" class="scroll-mt-40">
          <h2 class="t-h2">{{ t('detail.overview.title') }}</h2>
          <dl class="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
            <div class="bg-ihram p-5"><dt class="flex items-center gap-2 t-label text-stone"><Icon name="ph:buildings-light" class="text-[1.125rem]" aria-hidden="true" />{{ t('detail.overview.hotelMakkah') }}</dt><dd class="mt-2">{{ t('detail.overview.stars', { n: p.hotel.stars }) }} · {{ t('detail.overview.walk', { min: p.hotel.makkahWalkMin, m: p.hotel.makkahDistanceM }) }}</dd></div>
            <div class="bg-ihram p-5"><dt class="flex items-center gap-2 t-label text-nabawi"><Icon name="ph:mosque-light" class="text-[1.125rem]" aria-hidden="true" />{{ t('detail.overview.hotelMadinah') }}</dt><dd class="mt-2">{{ t('detail.overview.stars', { n: p.hotel.stars }) }} · {{ t('detail.overview.walkShort', { min: p.hotel.madinahWalkMin }) }}</dd></div>
            <div class="bg-ihram p-5"><dt class="flex items-center gap-2 t-label text-stone"><Icon name="ph:van-light" class="text-[1.125rem]" aria-hidden="true" />{{ t('detail.overview.transport') }}</dt><dd class="mt-2">{{ dt(p.transport) }}</dd></div>
            <div class="bg-ihram p-5"><dt class="flex items-center gap-2 t-label text-stone"><Icon name="ph:airplane-tilt-light" class="text-[1.125rem]" aria-hidden="true" />{{ t('detail.overview.flights') }}</dt><dd class="mt-2">{{ p.flightsIncluded ? t('detail.overview.flightsYes') : t('detail.overview.flightsNo') }} · {{ p.departureCities.map(cityName).join(', ') }}</dd></div>
          </dl>
        </section>

        <section id="itinerary" class="scroll-mt-40">
          <h2 class="t-h2">{{ t('detail.itinerary.title') }}</h2>
          <RouteLine class="mt-8 max-w-2xl" :points="routePoints" :label="t('journey.routeLabel')" compact />
          <ol class="relative mt-10 grid gap-8 ps-10">
            <span class="absolute bottom-2 start-[11px] top-2 w-px bg-line" aria-hidden="true" />
            <li v-for="d in p.itinerary" :key="d.day" class="relative">
              <span
                class="absolute -start-10 top-1 grid size-6 place-items-center rounded-full border-2 bg-ihram"
                :class="d.city === 'madinah' ? 'border-nabawi' : d.city === 'makkah' ? 'border-kiswa' : 'border-line'"
                aria-hidden="true"
              >
                <span class="size-2 rounded-full" :class="d.city === 'madinah' ? 'bg-nabawi' : d.city === 'makkah' ? 'bg-kiswa' : 'bg-stone/40'" />
              </span>
              <p class="t-label" :class="d.city === 'madinah' ? 'text-nabawi' : 'text-stone'">{{ dt(d.day) }}<template v-if="d.city !== 'travel'"> · {{ t(`search.cities.${d.city}`) }}</template></p>
              <h3 class="t-h3 mt-1">{{ dt(d.title) }}</h3>
              <p class="mt-1.5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-stone">{{ dt(d.text) }}</p>
            </li>
          </ol>
        </section>

        <section id="hotels" class="scroll-mt-40">
          <h2 class="t-h2">{{ t('detail.hotels.title') }}</h2>
          <ul class="mt-8 grid gap-4 md:grid-cols-2">
            <li v-for="h in stayHotels" :key="h.id"><HotelCard :hotel="h" :nights="h.city === 'makkah' ? p.nights.makkah : p.nights.madinah" /></li>
          </ul>
        </section>

        <section id="included" class="scroll-mt-40">
          <h2 class="t-h2">{{ t('detail.included.title') }}</h2>
          <div class="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 class="t-label font-body! text-kiswa">{{ t('detail.included.yes') }}</h3>
              <ul class="mt-4 grid gap-3">
                <li v-for="i in p.included" :key="i" class="flex items-start gap-3 text-[0.9375rem]">
                  <Icon name="ph:check-circle-light" class="mt-0.5 shrink-0 text-[1.25rem]" aria-hidden="true" />{{ dt(i) }}
                </li>
              </ul>
            </div>
            <div>
              <h3 class="t-label font-body! text-stone">{{ t('detail.included.no') }}</h3>
              <ul class="mt-4 grid gap-3">
                <li v-for="i in p.notIncluded" :key="i" class="flex items-start gap-3 text-[0.9375rem] text-stone">
                  <Icon name="ph:minus-circle-light" class="mt-0.5 shrink-0 text-[1.25rem]" aria-hidden="true" />{{ dt(i) }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="visa" class="scroll-mt-40">
          <h2 class="t-h2">{{ t('detail.visa.title') }}</h2>
          <p class="mt-4 max-w-[56ch] text-stone">{{ t('detail.visa.text') }}</p>
          <ul class="mt-6 grid gap-3">
            <li v-for="r in visa.requirements" :key="r.label" class="flex items-start gap-3 text-[0.9375rem]">
              <Icon :name="r.confirmed ? 'ph:check-circle-light' : 'ph:question-light'" class="mt-0.5 shrink-0 text-[1.25rem]" :class="!r.confirmed && 'text-stone'" aria-hidden="true" />
              <span v-if="r.confirmed">{{ dt(r.label) }}</span>
              <GapText v-else :text="r.label" />
            </li>
          </ul>
          <p class="mt-5 text-[0.9375rem]"><span class="text-stone">{{ t('detail.visa.processing') }}:</span> <span v-if="visa.processingDays" class="ltr-iso">{{ visa.processingDays }}</span><GapText v-else :text="t('detail.visa.processingGap')" /></p>
        </section>

        <section id="payment" class="scroll-mt-40">
          <h2 class="t-h2">{{ t('detail.payment.title') }}</h2>
          <p class="mt-4"><GapText :text="t('detail.payment.gap')" /></p>
          <p class="mt-4 text-[0.875rem] text-stone">{{ t('detail.payment.methods') }}: {{ site.payments.join(' · ') }}</p>
        </section>

        <section id="cancellation" class="scroll-mt-40">
          <h2 class="t-h2">{{ t('detail.cancellation.title') }}</h2>
          <p class="mt-4"><GapText :text="t('detail.cancellation.gap')" /></p>
        </section>

        <section id="questions" class="scroll-mt-40">
          <h2 class="t-h2 mb-8">{{ t('detail.questions.title') }}</h2>
          <HomeFaq id="pkg-faq" :faqs="pkgFaqs" :heading="false" />
        </section>
      </div>

      <!-- sticky booking card (desktop) -->
      <aside class="hidden lg:block">
        <div class="sticky top-[150px] rounded-md border border-line bg-ihram p-6 shadow-[0_24px_60px_-40px_rgba(11,11,12,.45)]">
          <BookingCard :pkg="p" id-prefix="bk-d" />
        </div>
      </aside>
    </div>

    <section class="wrap section-y" aria-labelledby="similar-h">
      <h2 id="similar-h" class="t-h2">{{ t('detail.similar') }}</h2>
      <ul class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="s in similar" :key="s.slug"><PackageCard :pkg="s" /></li>
      </ul>
    </section>

    <!-- mobile bottom bar → expands into a sheet -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ihram/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-[2px] lg:hidden">
      <div class="flex items-center gap-3">
        <button type="button" class="min-w-0 flex-1 text-start" :aria-label="t('detail.book.open')" @click="bookOpen = true">
          <span class="t-label block truncate text-stone">{{ t('detail.book.adult', { n: booking.travellers }, booking.travellers) }}</span>
          <span class="flex items-center gap-1.5">
            <span class="ltr-iso text-[1.25rem] font-semibold tabular-nums">{{ formatNgn(total) }}</span>
            <Icon name="ph:caret-up-light" aria-hidden="true" />
          </span>
        </button>
        <AppButton @click="bookOpen = true">{{ t('detail.book.enquire') }}</AppButton>
      </div>
    </div>
    <UiSheet v-model:open="bookOpen" :title="dt(p.name)" side="bottom">
      <BookingCard :pkg="p" id-prefix="bk-m" class="pb-4" />
    </UiSheet>
  </div>
</template>

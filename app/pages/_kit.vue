<script setup lang="ts">
/** Temporary component kit (Phase 1). Removed from production in Phase 10. */
definePageMeta({ layout: false })
useHead({ title: 'Kit', meta: [{ name: 'robots', content: 'noindex' }] })

const amount = ref(2400000)
const rooms = { quad: 2400000, triple: 2650000, double: 3050000 } as const
const room = ref<keyof typeof rooms>('quad')
watch(room, r => { amount.value = rooms[r] })
const step = ref(3)
</script>

<template>
  <div class="min-h-screen bg-ihram pb-24">
    <header class="wrap flex items-baseline justify-between py-8">
      <h1 class="t-h2">Component kit</h1>
      <p class="t-label text-stone">Phase 1 · temporary</p>
    </header>

    <template v-for="dir in (['ltr', 'rtl'] as const)" :key="dir">
      <div :dir="dir" :lang="dir === 'rtl' ? 'ar' : 'en'" :class="dir === 'rtl' && 'border-t border-line pt-10'">
        <p class="wrap t-label pb-6 text-stone">Direction: {{ dir }}</p>

        <!-- ===== On white ===== -->
        <section class="wrap grid gap-12 pb-16">
          <div>
            <ArabicEyebrow ar="الباقات" label="Umrah packages" />
            <h2 class="t-h2 mt-4">Choose how you'd like to travel</h2>
          </div>

          <div class="grid gap-4">
            <p class="t-label text-stone">Buttons · md</p>
            <div class="flex flex-wrap items-center gap-3">
              <AppButton>Plan my Umrah</AppButton>
              <AppButton icon-end="ph:arrow-right-light">View package</AppButton>
              <AppButton variant="secondary">Enquire</AppButton>
              <AppButton variant="secondary" icon-start="ph:whatsapp-logo-light">Ask on WhatsApp</AppButton>
              <AppButton variant="link" icon-end="ph:arrow-right-light">See all packages</AppButton>
              <AppButton disabled>Disabled</AppButton>
            </div>
            <p class="t-label text-stone">Buttons · lg</p>
            <div class="flex flex-wrap items-center gap-3">
              <AppButton size="lg">Show packages</AppButton>
              <AppButton size="lg" variant="secondary">Send an email</AppButton>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-3">
            <div class="grid gap-3">
              <p class="t-label text-stone">AppImage · ready, arch</p>
              <AppImage slot="pkg-rahmah" arch sizes="100vw md:400px" />
            </div>
            <div class="grid gap-3">
              <p class="t-label text-stone">AppImage · pending (light)</p>
              <AppImage slot="journey-train" arch />
            </div>
            <div class="grid gap-3">
              <p class="t-label text-stone">AppImage · pending 4:3 + pending dark 16:9</p>
              <AppImage slot="hotel-room" />
              <AppImage slot="stories-video" />
            </div>
          </div>

          <div class="grid gap-8 md:grid-cols-2">
            <div class="grid gap-4">
              <p class="t-label text-stone">SampleBadge · PriceTag (animated on room change)</p>
              <div class="flex flex-wrap items-center gap-3">
                <SampleBadge />
                <SampleBadge variant="dark" />
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="r in (['quad', 'triple', 'double'] as const)"
                  :key="r"
                  type="button"
                  class="min-h-11 rounded-pill border px-4 text-sm capitalize"
                  :class="room === r ? 'border-kiswa bg-kiswa text-ihram' : 'border-line'"
                  @click="room = r"
                >
                  {{ r }}
                </button>
              </div>
              <PriceTag :amount="amount" prefix="From" suffix="per person" animated />
              <PriceTag :amount="5300000" size="lg" />
              <PriceTag :amount="95000" size="sm" prefix="From" />
            </div>
            <div class="grid content-start gap-4">
              <p class="t-label text-stone">NightsSplit</p>
              <NightsSplit :makkah="5" :madinah="5" />
              <NightsSplit :makkah="7" :madinah="4" />
              <NightsSplit :makkah="4" :madinah="3" size="sm" :label="false" />
              <p class="t-label text-stone">GapText</p>
              <p>Licence: <GapText /> · Deposit <GapText text="[x]%" /></p>
            </div>
          </div>

          <div class="grid gap-4">
            <p class="t-label text-stone">TawafProgress · sm loading · lg loading · progress</p>
            <div class="flex flex-wrap items-end gap-12 pb-8">
              <TawafProgress />
              <TawafProgress size="lg" />
              <TawafProgress size="lg" mode="progress" :value="step" />
              <TawafProgress mode="progress" :value="step" />
              <AppButton variant="secondary" @click="step = (step % 7) + 1">Next round</AppButton>
            </div>
          </div>

          <div class="relative h-48 overflow-hidden rounded-md border border-line bg-marble">
            <MashrabiyaPattern :opacity="0.5" />
            <p class="t-label absolute start-4 top-4 text-stone">MashrabiyaPattern (shown at 50% to inspect)</p>
          </div>
        </section>

        <!-- ===== Arcade edge white → kiswa ===== -->
        <ArcadeEdge from="ihram" to="kiswa" />

        <!-- ===== On Kiswa ===== -->
        <section class="on-dark relative overflow-hidden bg-kiswa py-16 text-on-dark">
          <MashrabiyaPattern :opacity="0.06" color="#fff" />
          <div class="wrap relative grid gap-12">
            <div>
              <ArabicEyebrow ar="لبيك" label="Licensed Umrah company · Makkah" tone="dark" />
              <h2 class="t-h2 mt-4">Start your Umrah with a conversation.</h2>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <AppButton variant="on-dark" icon-start="ph:whatsapp-logo-light">Chat on WhatsApp</AppButton>
              <AppButton variant="on-dark-outline">Send an email</AppButton>
              <AppButton variant="link-dark" icon-end="ph:arrow-right-light">See all packages</AppButton>
              <SampleBadge variant="dark" />
            </div>
            <div class="flex flex-wrap items-end gap-10">
              <PriceTag :amount="amount" prefix="From" suffix="per person" tone="dark" animated />
              <TawafProgress size="lg" tone="dark" />
              <p>WhatsApp: <GapText /></p>
            </div>

            <div class="relative overflow-hidden rounded-[22px]">
              <AppImage slot="hero-still" ratio="16:9" rounded="none" />
              <div class="absolute inset-0 grid place-items-center p-6">
                <GlassPanel class="w-full max-w-xl p-6" radius="lg">
                  <p class="t-label text-on-dark">GlassPanel over imagery</p>
                  <p class="mt-2 text-sm">Move the pointer: the specular highlight follows on desktop.</p>
                  <div class="mt-4 flex items-center gap-3">
                    <SampleBadge variant="glass" />
                    <AppButton variant="on-dark" size="md">Show packages</AppButton>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== Arcade edge kiswa → ihram, then KiswaBand ===== -->
        <ArcadeEdge from="kiswa" to="ihram" />
        <div class="wrap py-10">
          <p class="t-label text-stone">KiswaBand</p>
        </div>
        <KiswaBand />
        <div class="h-16 bg-kiswa" />
      </div>
    </template>
  </div>
</template>

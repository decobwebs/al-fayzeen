<script setup lang="ts">
const { heroPage } = useSiteChrome()
const { state } = useEnquiry()
// the sheet (and zod) loads on first use, keeping it out of the initial bundle
const enquiryMounted = ref(false)
watch(() => state.value.open, (o) => { if (o) enquiryMounted.value = true }, { immediate: true })
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <SiteNav />
    <main id="main" tabindex="-1" class="flex-1 outline-none" :class="!heroPage && 'pt-[72px]'">
      <slot />
    </main>
    <SiteFooter />
    <WhatsAppFloat />
    <LazyEnquirySheet v-if="enquiryMounted" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ heroNav: true })
const { t } = useI18n()
useHead({ title: () => t('hero.h1Full') })
</script>

<template>
  <div>
    <HomeHero />
    <HomeTrust />
    <HomeServices />
    <HomeWhyDirect />
    <HomePackages />
    <HomeHowItWorks />
    <HomeJourney />
    <ArcadeEdge from="ihram" to="marble" />
    <HomeHotels />
    <HomeIncluded />
    <HomeStories />
    <HomeGuide />
    <HomeFaq />
    <HomeCta />
  </div>
</template>

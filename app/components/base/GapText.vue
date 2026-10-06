<script setup lang="ts">
/** Visible gap for a fact the client hasn't confirmed. Never replace with an invented value. */
withDefaults(defineProps<{ text?: string, as?: string }>(), { as: 'span' })
const { t } = useI18n()
</script>

<template>
  <component :is="as" class="gap-text" :title="t('common.gapHint')">{{ text ?? t('common.tbc') }}</component>
</template>

/** Keeps formatDate() in step with the active language (server and client). */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as { locale: Ref<string> }
  const apply = (l: string) => { dateLocale.value = l === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB' }
  apply(i18n.locale.value)
  watch(i18n.locale, apply)
})

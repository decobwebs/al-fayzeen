/** Scroll-driven state shared by SiteNav and WhatsAppFloat. */
export function useSiteChrome() {
  const route = useRoute()
  const { y } = useWindowScroll()
  const { height: vh } = useWindowSize()
  const hidden = useState('nav-hidden', () => false)
  const menuOpen = useState('menu-open', () => false)

  const heroPage = computed(() => !!route.meta.heroNav)
  /** nav sits transparent over the hero until 80px of scroll */
  const navOverHero = computed(() => heroPage.value && y.value < 80 && !menuOpen.value)
  /** the float stays glass while the hero fills most of the screen */
  const floatOverHero = computed(() => heroPage.value && y.value < Math.max(vh.value * 0.6, 300))

  return { y, hidden, menuOpen, heroPage, navOverHero, floatOverHero }
}

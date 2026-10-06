declare module '#app' {
  interface PageMeta {
    /** the page opens with a dark full-bleed hero: nav and WhatsApp float start in glass */
    heroNav?: boolean
    /** the page has a fixed bottom bar on mobile: lift the WhatsApp float above it */
    bottomBar?: boolean
  }
}
export {}
